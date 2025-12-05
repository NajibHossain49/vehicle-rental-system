import pool from '../../utils/db';
import { validateUpdateUser } from './user.validation';

export const getAllUsers = async () => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM users ORDER BY id`
  );
  return result.rows;
};

export const updateUser = async (userId: number, updates: any, currentUser: any) => {
  const validated = validateUpdateUser(updates);

  // Customer can only update own profile (except role)
  if (currentUser.role !== 'admin' && currentUser.id !== userId) {
    throw new Error('You can only update your own profile');
  }

  if (currentUser.role !== 'admin' && validated.role) {
    throw new Error('You cannot change your role');
  }

  // If email is being changed, check uniqueness
  if (validated.email) {
    const emailCheck = await pool.query(
      'SELECT id FROM users WHERE email = $1 AND id != $2',
      [validated.email, userId]
    );
    if (emailCheck.rows.length > 0) {
    throw new Error('Email already in use by another account');
    }
  }

  const fields = Object.keys(validated);
  const values = Object.values(validated);
  const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
  const query = `
    UPDATE users SET ${setClause}
    WHERE id = $${fields.length + 1}
    RETURNING id, name, email, phone, role
  `;

  const result = await pool.query(query, [...values, userId]);

  if (result.rows.length === 0) {
    throw new Error('User not found');
  }

  return result.rows[0];
};

export const deleteUser = async (userId: number) => {
  // Check active bookings
  const bookingCheck = await pool.query(
    `SELECT id FROM bookings WHERE customer_id = $1 AND status = 'active'`,
    [userId]
  );

  if (bookingCheck.rows.length > 0) {
    throw new Error('Cannot delete user with active bookings');
  }

  const result = await pool.query(
    'DELETE FROM users WHERE id = $1 RETURNING id',
    [userId]
  );

  if (result.rows.length === 0) {
    throw new Error('User not found');
  }

  return { message: 'User deleted successfully' };
};
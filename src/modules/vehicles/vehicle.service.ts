import pool from '../../utils/db';
import { validateCreateVehicle, validateUpdateVehicle } from './vehicle.validation';

export const createVehicle = async (body: any) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = validateCreateVehicle(body);

  const result = await pool.query(
    `INSERT INTO vehicles 
     (vehicle_name, type, registration_number, daily_rent_price, availability_status)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status`,
    [vehicle_name, type, registration_number, daily_rent_price, availability_status]
  );

  return result.rows[0];
};

export const getAllVehicles = async () => {
  const result = await pool.query(
    `SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status
     FROM vehicles ORDER BY id`
  );
  return result.rows;
};

export const getVehicleById = async (id: number) => {
  const result = await pool.query(
    `SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status
     FROM vehicles WHERE id = $1`,
    [id]
  );
  if (result.rows.length === 0) {
    throw new Error('Vehicle not found');
  }
  return result.rows[0];
};

export const updateVehicle = async (id: number, body: any) => {
  const updates = validateUpdateVehicle(body);
  if (Object.keys(updates).length === 0) {
    throw new Error('No valid fields to update');
  }

  const fields = Object.keys(updates);
  const values = Object.values(updates);
  const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
  const query = `
    UPDATE vehicles SET ${setClause}
    WHERE id = $${fields.length + 1}
    RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status
  `;

  const result = await pool.query(query, [...values, id]);
  if (result.rows.length === 0) {
    throw new Error('Vehicle not found');
  }
  return result.rows[0];
};

export const deleteVehicle = async (id: number) => {
  // Check if vehicle has active bookings
  const bookingCheck = await pool.query(
    `SELECT id FROM bookings WHERE vehicle_id = $1 AND status = 'active'`,
    [id]
  );

  if (bookingCheck.rows.length > 0) {
    throw new Error('Cannot delete vehicle with active bookings');
  }

  const result = await pool.query(
    'DELETE FROM vehicles WHERE id = $1 RETURNING id',
    [id]
  );

  if (result.rows.length === 0) {
    throw new Error('Vehicle not found');
  }

  return { message: 'Vehicle deleted successfully' };
};
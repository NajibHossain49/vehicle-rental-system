import pool from '../../utils/db';
import bcrypt from 'bcryptjs';
import { validateSignup, validateSignin } from './auth.validation';
import { signToken } from '../../utils/jwt';

export const signup = async (body: any) => {
  const { name, email, password, phone, role } = validateSignup(body);
  const hashedPassword = await bcrypt.hash(password, 12);

  const result = await pool.query(
    `INSERT INTO users (name, email, password, phone, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, phone, role`,
    [name, email, hashedPassword, phone, role]
  );

  return result.rows[0];
};

export const signin = async (body: any) => {
  const { email, password } = validateSignin(body);

  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid email or password');
  }

  const token = signToken({ id: user.id, role: user.role });
  const { password: _, ...userWithoutPassword } = user;

  return { token, user: userWithoutPassword };
};
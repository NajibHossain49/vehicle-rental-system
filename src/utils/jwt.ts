import jwt from 'jsonwebtoken';
import config from '../config';

if (!config.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in config');
}

export const signToken = (payload: { id: number; role: string }) => {
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): { id: number; role: string } => {
  return jwt.verify(token, config.JWT_SECRET) as { id: number; role: string };
};
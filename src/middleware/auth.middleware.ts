import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import pool from '../utils/db';

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      const error = new Error('You are not logged in');
      (error as any).statusCode = 401;
      return next(error);
    }

    const decoded = verifyToken(token);

    const result = await pool.query(
      'SELECT id, role FROM users WHERE id = $1',
      [decoded.id]
    );

    if (result.rows.length === 0) {
      const error = new Error('User no longer exists');
      (error as any).statusCode = 401;
      return next(error);
    }

    req.user = {
      id: result.rows[0].id,
      role: result.rows[0].role,
    };

    next();
  } catch (err: any) {
    err.message = err.message || 'Invalid token';
    (err as any).statusCode = 401;
    next(err);
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      const error = new Error('You do not have permission to perform this action');
      (error as any).statusCode = 403;
      return next(error);
    }
    next();
  };
};
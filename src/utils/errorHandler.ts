import { Request, Response, NextFunction } from 'express';

export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('ERROR:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong';

  // PostgreSQL unique violation
  if (err.code === '23505') {
    return res.status(400).json({
      success: false,
      message: 'Email already exists',
    });
  }

  // Validation errors
  if (message.includes('required') || message.includes('valid')) {
    return res.status(400).json({
      success: false,
      message,
    });
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};
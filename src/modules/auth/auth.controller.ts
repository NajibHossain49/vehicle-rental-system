import { Request, Response, NextFunction } from 'express';
import { signup, signin } from './auth.service';
import { catchAsync } from '../../utils/errorHandler';

export const signupHandler = catchAsync(async (req: Request, res: Response) => {
  const newUser = await signup(req.body);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: newUser,
  });
});

export const signinHandler = catchAsync(async (req: Request, res: Response) => {
  const { token, user } = await signin(req.body);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: { token, user },
  });
});
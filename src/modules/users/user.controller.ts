import { Request, Response } from 'express';
import { catchAsync } from '../../utils/errorHandler';
import * as userService from './user.service';

export const getAllUsersHandler = catchAsync(async (req: Request, res: Response) => {
  const users = await userService.getAllUsers();
  res.status(200).json({
    success: true,
    message: 'Users retrieved successfully',
    data: users,
  });
});

export const updateUserHandler = catchAsync(async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  const updatedUser = await userService.updateUser(userId, req.body, req.user!);

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: updatedUser,
  });
});

export const deleteUserHandler = catchAsync(async (req: Request, res: Response) => {
  await userService.deleteUser(Number(req.params.userId));
  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
  });
});
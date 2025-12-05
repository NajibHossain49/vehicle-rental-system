import { Router } from 'express';
import * as controller from './user.controller';
import { protect, restrictTo } from '../../middleware/auth.middleware';

const router = Router();

// Admin only: Get all users
router.get('/', protect, restrictTo('admin'), controller.getAllUsersHandler);

// Protected: Update own or admin can update any
router.put('/:userId', protect, controller.updateUserHandler);

// Admin only: Delete user
router.delete('/:userId', protect, restrictTo('admin'), controller.deleteUserHandler);

export default router;
import express from 'express';
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getMe,
} from '../controllers/user.controller';
import { protect, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  updateUserValidation,
  getUsersValidation,
} from '../validators/user.validator';

const router = express.Router();

// Protect all routes
router.use(protect);

// Routes accessible by both store manager and HOD
router.get('/me', getMe);

// Routes accessible only by store manager
router.get('/', authorize('store_manager'), getUsersValidation, validate, getUsers);
router.get('/:id', authorize('store_manager'), getUser);
router.put('/:id', authorize('store_manager'), updateUserValidation, validate, updateUser);
router.delete('/:id', authorize('store_manager'), deleteUser);

export default router; 
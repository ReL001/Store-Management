import express from 'express';
import {
  createRequest,
  getRequests,
  getRequest,
  updateRequest,
  deleteRequest,
  updateRequestStatus,
} from '../controllers/request.controller';
import { protect, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createRequestValidation,
  updateRequestValidation,
  updateRequestStatusValidation,
  getRequestsValidation,
} from '../validators/request.validator';

const router = express.Router();

// Protect all routes
router.use(protect);

// Routes accessible by both store manager and HOD
router.get('/', getRequestsValidation, validate, getRequests);
router.get('/:id', getRequest);

// Routes accessible only by HOD
router.post('/', authorize('hod'), createRequestValidation, validate, createRequest);
router.put('/:id', authorize('hod'), updateRequestValidation, validate, updateRequest);
router.delete('/:id', authorize('hod'), deleteRequest);

// Routes accessible only by store manager
router.patch('/:id/status', authorize('store_manager'), updateRequestStatusValidation, validate, updateRequestStatus);

export default router; 
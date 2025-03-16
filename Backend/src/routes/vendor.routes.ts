import express from 'express';
import {
  getVendors,
  getVendor,
  createVendor,
  updateVendor,
  deleteVendor,
  updateVendorStatus,
  updateVendorRating,
} from '../controllers/vendor.controller';
import { protect, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createVendorValidation,
  updateVendorValidation,
  updateVendorStatusValidation,
  updateVendorRatingValidation,
} from '../validators/vendor.validator';

const router = express.Router();

// Protect all routes
router.use(protect);

// Routes accessible by store manager only
router.get('/', authorize('store_manager'), getVendors);
router.post('/', authorize('store_manager'), createVendorValidation, validate, createVendor);
router.get('/:id', authorize('store_manager'), getVendor);
router.put('/:id', authorize('store_manager'), updateVendorValidation, validate, updateVendor);
router.delete('/:id', authorize('store_manager'), deleteVendor);
router.patch('/:id/status', authorize('store_manager'), updateVendorStatusValidation, validate, updateVendorStatus);
router.patch('/:id/rating', authorize('store_manager'), updateVendorRatingValidation, validate, updateVendorRating);

export default router; 
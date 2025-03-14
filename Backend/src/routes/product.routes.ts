import express from 'express';
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  updateProductStatus,
} from '../controllers/product.controller';
import { protect, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createProductValidation,
  updateProductValidation,
  updateProductStatusValidation,
  getProductsValidation,
} from '../validators/product.validator';

const router = express.Router();

// Protect all routes
router.use(protect);

// Routes accessible by both store manager and HOD
router.get('/', getProductsValidation, validate, getProducts);
router.get('/:id', getProduct);

// Routes accessible only by store manager
router.post('/', authorize('store_manager'), createProductValidation, validate, createProduct);
router.put('/:id', authorize('store_manager'), updateProductValidation, validate, updateProduct);
router.delete('/:id', authorize('store_manager'), deleteProduct);

// Routes accessible only by HOD
router.patch('/:id/status', authorize('hod'), updateProductStatusValidation, validate, updateProductStatus);

export default router; 
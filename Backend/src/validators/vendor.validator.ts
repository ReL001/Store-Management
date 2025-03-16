import { body } from 'express-validator';

export const createVendorValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Vendor name is required'),
  body('email')
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required'),
  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required'),
  body('gstNumber')
    .optional()
    .trim(),
  body('products')
    .isArray()
    .withMessage('Products must be an array'),
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Invalid status'),
];

export const updateVendorValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Vendor name cannot be empty'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),
  body('phone')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Phone number cannot be empty'),
  body('address')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Address cannot be empty'),
  body('gstNumber')
    .optional()
    .trim(),
  body('products')
    .optional()
    .isArray()
    .withMessage('Products must be an array'),
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Invalid status'),
];

export const updateVendorStatusValidation = [
  body('status')
    .isIn(['active', 'inactive'])
    .withMessage('Invalid status'),
];

export const updateVendorRatingValidation = [
  body('rating')
    .isFloat({ min: 0, max: 5 })
    .withMessage('Rating must be between 0 and 5'),
]; 
import { body, query } from 'express-validator';

export const createProductValidation = [
  body('gin')
    .notEmpty()
    .withMessage('GIN number is required')
    .trim(),
  body('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Invalid date format'),
  body('department')
    .notEmpty()
    .withMessage('Department is required')
    .trim(),
  body('billNumber')
    .notEmpty()
    .withMessage('Bill number is required')
    .trim(),
  body('items')
    .isArray()
    .withMessage('Items must be an array')
    .notEmpty()
    .withMessage('At least one item is required'),
  body('items.*.name')
    .notEmpty()
    .withMessage('Item name is required')
    .trim(),
  body('items.*.description')
    .notEmpty()
    .withMessage('Item description is required')
    .trim(),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('vendor.name')
    .notEmpty()
    .withMessage('Vendor name is required')
    .trim(),
  body('vendor.contact')
    .notEmpty()
    .withMessage('Vendor contact is required')
    .trim(),
  body('vendor.address')
    .notEmpty()
    .withMessage('Vendor address is required')
    .trim(),
  body('totalAmount')
    .isFloat({ min: 0 })
    .withMessage('Total amount must be a positive number'),
];

export const updateProductValidation = [
  body('gin')
    .optional()
    .trim(),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),
  body('department')
    .optional()
    .trim(),
  body('billNumber')
    .optional()
    .trim(),
  body('items')
    .optional()
    .isArray()
    .withMessage('Items must be an array'),
  body('items.*.name')
    .optional()
    .trim(),
  body('items.*.description')
    .optional()
    .trim(),
  body('items.*.quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('vendor.name')
    .optional()
    .trim(),
  body('vendor.contact')
    .optional()
    .trim(),
  body('vendor.address')
    .optional()
    .trim(),
  body('totalAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Total amount must be a positive number'),
];

export const updateProductStatusValidation = [
  body('status')
    .isIn(['approved', 'rejected'])
    .withMessage('Status must be either approved or rejected'),
];

export const getProductsValidation = [
  query('status')
    .optional()
    .isIn(['pending', 'approved', 'rejected'])
    .withMessage('Invalid status'),
  query('department')
    .optional()
    .trim(),
]; 
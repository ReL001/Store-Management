import { body, query } from 'express-validator';

export const createRequestValidation = [
  body('department')
    .notEmpty()
    .withMessage('Department is required')
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
  body('totalAmount')
    .isFloat({ min: 0 })
    .withMessage('Total amount must be a positive number'),
  body('notes')
    .optional()
    .trim(),
];

export const updateRequestValidation = [
  body('department')
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
  body('totalAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Total amount must be a positive number'),
  body('notes')
    .optional()
    .trim(),
];

export const updateRequestStatusValidation = [
  body('status')
    .isIn(['approved', 'rejected'])
    .withMessage('Status must be either approved or rejected'),
];

export const getRequestsValidation = [
  query('status')
    .optional()
    .isIn(['pending', 'approved', 'rejected'])
    .withMessage('Invalid status'),
]; 
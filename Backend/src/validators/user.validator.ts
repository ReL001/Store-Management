import { body, query } from 'express-validator';

export const updateUserValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name cannot be empty'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),
  body('role')
    .optional()
    .isIn(['store_manager', 'hod'])
    .withMessage('Invalid role'),
  body('department')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Department cannot be empty'),
];

export const getUsersValidation = [
  query('role')
    .optional()
    .isIn(['store_manager', 'hod'])
    .withMessage('Invalid role'),
  query('department')
    .optional()
    .trim(),
]; 
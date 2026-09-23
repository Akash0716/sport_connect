import { body } from 'express-validator';

export const sportValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Sport name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Sport name must be between 2 and 50 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Description must not exceed 255 characters'),
  body('icon')
    .optional()
    .trim(),
];

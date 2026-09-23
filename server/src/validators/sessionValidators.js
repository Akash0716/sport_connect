import { body } from 'express-validator';

export const createSessionValidator = [
  body('sportId')
    .notEmpty()
    .withMessage('Please select a valid sport'),
  body('date')
    .notEmpty()
    .withMessage('Session date is required')
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Date must be formatted as YYYY-MM-DD'),
  body('startTime')
    .notEmpty()
    .withMessage('Start time is required')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('Start time must be formatted as HH:mm (24-hour)'),
  body('venue')
    .trim()
    .notEmpty()
    .withMessage('Venue location is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Venue must be between 3 and 100 characters'),
  body('additionalPlayersNeeded')
    .notEmpty()
    .withMessage('Additional players required count is mandatory')
    .isInt({ min: 1, max: 100 })
    .withMessage('Additional players needed must be between 1 and 100'),
];

export const cancelSessionValidator = [
  body('cancellationReason')
    .trim()
    .notEmpty()
    .withMessage('Cancellation reason is required')
    .isLength({ min: 5, max: 255 })
    .withMessage('Cancellation reason must be between 5 and 255 characters'),
];

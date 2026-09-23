import express from 'express';
import {
  getSports,
  createSport,
  updateSport,
  deleteSport,
} from '../controllers/sportController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRole } from '../middleware/roleMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { sportValidator } from '../validators/sportValidators.js';

const router = express.Router();

// GET /api/sports (all authenticated users)
router.get('/', authenticate, getSports);

// ADMIN ONLY Routes
router.post('/', authenticate, authorizeRole('ADMIN'), sportValidator, validate, createSport);
router.put('/:id', authenticate, authorizeRole('ADMIN'), sportValidator, validate, updateSport);
router.delete('/:id', authenticate, authorizeRole('ADMIN'), deleteSport);

export default router;

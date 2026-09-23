import express from 'express';
import {
  getSessions,
  getSessionById,
  createSession,
  joinSession,
  cancelSession,
  deleteSession,
  getMyCreatedSessions,
  getMyJoinedSessions,
} from '../controllers/sessionController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import {
  createSessionValidator,
  cancelSessionValidator,
} from '../validators/sessionValidators.js';

const router = express.Router();

// All session routes require authentication
router.use(authenticate);

router.get('/', getSessions);
router.get('/my-created', getMyCreatedSessions);
router.get('/my-joined', getMyJoinedSessions);
router.get('/:id', getSessionById);

router.post('/', createSessionValidator, validate, createSession);
router.post('/:id/join', joinSession);
router.post('/:id/cancel', cancelSessionValidator, validate, cancelSession);
router.delete('/:id', deleteSession);

export default router;

import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  changePassword,
} from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import {
  registerValidator,
  loginValidator,
  changePasswordValidator,
} from '../validators/authValidators.js';

const router = express.Router();

router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);
router.put('/change-password', authenticate, changePasswordValidator, validate, changePassword);

export default router;

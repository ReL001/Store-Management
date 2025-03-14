import express from 'express';
import { register, login } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import {
  registerValidation,
  loginValidation,
} from '../validators/auth.validator';

const router = express.Router();

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);

export default router; 
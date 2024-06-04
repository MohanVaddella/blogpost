// userRoutes.js
import express from 'express';
import { registerUser, loginUser } from './userController';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);

export default router;


import express from 'express';
import gameRoutes from './game-routes.js';
import authRoutes from './auth-routes.js';
import userRoutes from './user-routes.js';
import requireAuth from '../middlewares/require-auth.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/game', requireAuth, gameRoutes);
router.use('/user', requireAuth, userRoutes);

export default router;

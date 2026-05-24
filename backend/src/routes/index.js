import { Router } from 'express';
import authRoutes from './authRoutes.js';
import datasetRoutes from './datasetRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/datasets', datasetRoutes);
router.use('/dashboards', dashboardRoutes);

export default router;

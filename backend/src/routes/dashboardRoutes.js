import { Router } from 'express';
import DashboardController from '../controllers/DashboardController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.post('/', DashboardController.createDashboard);
router.get('/', DashboardController.listDashboards);
router.get('/:id', DashboardController.getDashboard);
router.put('/:id', DashboardController.updateWidgets);
router.delete('/:id', DashboardController.deleteDashboard);

export default router;

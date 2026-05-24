import { Router } from 'express';
import DatasetController from '../controllers/DatasetController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.post('/', DatasetController.createDataset);
router.get('/', DatasetController.listDatasets);
router.get('/:id', DatasetController.getDataset);
router.delete('/:id', DatasetController.deleteDataset);

export default router;

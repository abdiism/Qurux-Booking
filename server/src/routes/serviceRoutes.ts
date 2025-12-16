import { Router } from 'express';
import { getAllServices, createService, deleteService } from '../controllers/serviceController';

const router = Router();

router.get('/', getAllServices);
router.post('/', createService);
router.delete('/:id', deleteService);

export default router;

import { Router } from 'express';
import { getAllSalons, updateSalon, createSalon } from '../controllers/salonController';

const router = Router();

router.get('/', getAllSalons);
router.post('/', createSalon);
router.put('/:id', updateSalon);

export default router;

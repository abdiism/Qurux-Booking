import { Router } from 'express';
import { addReview } from '../controllers/reviewController';

const router = Router();

router.post('/', addReview);

export default router;

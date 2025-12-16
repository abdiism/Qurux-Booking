import { Router } from 'express';
import { createBooking, cancelBooking, getBookings, updateBookingStatus, getAvailability } from '../controllers/bookingController';
import { authenticateUser } from '../middleware/auth';

const router = Router();

// Public route to check availability
router.get('/availability', getAvailability);

// Protected routes
router.use(authenticateUser);
router.post('/', createBooking);
router.get('/', getBookings);
router.put('/:id/cancel', cancelBooking);
router.put('/:id/status', updateBookingStatus);

export default router;

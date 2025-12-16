import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import salonRoutes from './routes/salonRoutes';
import reviewRoutes from './routes/reviewRoutes';
import bookingRoutes from './routes/bookingRoutes';
import serviceRoutes from './routes/serviceRoutes';
import profileRoutes from './routes/profileRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// --- Security Middleware ---
app.use(helmet()); // Secure Headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// Rate Limiting (Prevent DDoS)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// --- Routes ---
app.get('/', (req, res) => {
    res.send('Qurux Booking API is running securely.');
});

app.use('/api/salons', salonRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/profiles', profileRoutes);

// Start Server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

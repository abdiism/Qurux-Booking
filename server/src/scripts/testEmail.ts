
import dotenv from 'dotenv';
import path from 'path';

// Load env vars from server root
dotenv.config({ path: path.join(__dirname, '../../.env') });

import { emailService } from '../services/EmailService';

const testEmail = async () => {
    console.log('Testing Email Service...');
    console.log('SMTP Config:', {
        host: process.env.SMTP_HOST,
        user: process.env.SMTP_USER,
        from: process.env.FROM_EMAIL
    });

    try {
        await emailService.sendBookingConfirmation(process.env.SMTP_USER || '', {
            customerName: 'Test User',
            serviceName: 'Test Service',
            salonName: 'Test Salon',
            salonAddress: '123 Test St, Mogadishu',
            date: '2025-12-14',
            time: '10:00 AM',
            price: '$50.00',
            bookingLink: 'http://localhost:3000',
            rescheduleLink: 'http://localhost:3000'
        });
        console.log('✅ Email sent successfully! Check your inbox.');
    } catch (error) {
        console.error('❌ Failed to send email:', error);
    }
};

testEmail();

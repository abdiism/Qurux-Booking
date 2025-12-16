
import 'dotenv/config'; // Load .env from CWD (server root) immediately
import { emailService } from '../src/services/EmailService';
import path from 'path';

// We rely on CWD being 'g:\Qurux booking\server'
console.log('Current working directory:', process.cwd());

async function testRejectionEmail() {
    console.log('Testing Rejection Email Sending...');
    console.log('SMTP Config:', {
        host: process.env.SMTP_HOST,
        user: process.env.SMTP_USER,
        from: process.env.FROM_EMAIL
    });

    const mockDetails = {
        customerName: 'Test Customer',
        serviceName: 'Test Service',
        salonName: 'Test Salon',
        salonAddress: '123 Test St',
        date: '2023-12-25',
        time: '10:00 AM',
        price: '$50',
        bookingLink: 'https://qurux.app',
        rescheduleLink: 'https://qurux.app'
    };

    // Use the sender email as recipient for safety/testing
    const recipient = process.env.SMTP_USER || 'noeply.booking@gmail.com';

    try {
        await emailService.sendBookingRejection(recipient, mockDetails);
        console.log('✅ Rejection Email Sent Successfully!');
    } catch (error) {
        console.error('❌ Failed to send rejection email:', error);
    }
}

testRejectionEmail();

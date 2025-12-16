import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

interface BookingDetails {
    customerName: string;
    serviceName: string;
    salonName: string;
    salonAddress: string;
    date: string;
    time: string;
    price: string; // Formatted price
    bookingLink: string; // URL to view booking
    rescheduleLink: string;
}

export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        const user = process.env.SMTP_USER;
        const pass = process.env.SMTP_PASS?.replace(/\s+/g, ''); // Remove spaces from App Password

        // Debug logging
        console.log('[EmailService] Initializing with:', {
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            user: user,
            hasPass: !!pass
        });

        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: user,
                pass: pass,
            },
        });
    }

    private getTemplatePath(templateName: string): string {
        // Try to find the template in dist or src
        const possiblePaths = [
            path.join(__dirname, `../templates/${templateName}`), // Prod/Dist structure or Dev
            path.join(process.cwd(), `src/templates/${templateName}`), // Explicit Source
            path.join(process.cwd(), `server/src/templates/${templateName}`) // Root fallback
        ];

        for (const p of possiblePaths) {
            if (fs.existsSync(p)) return p;
        }

        throw new Error(`Email template ${templateName} not found`);
    }

    public async sendBookingConfirmation(toEmail: string, details: BookingDetails): Promise<void> {
        try {
            const templatePath = this.getTemplatePath('booking_confirmation.html');
            let html = fs.readFileSync(templatePath, 'utf-8');

            // Replace placeholders
            html = html.replace(/{{customer_name}}/g, details.customerName)
                .replace(/{{service_name}}/g, details.serviceName)
                .replace(/{{salon_name}}/g, details.salonName)
                .replace(/{{salon_address}}/g, details.salonAddress)
                .replace(/{{booking_date}}/g, details.date)
                .replace(/{{booking_time}}/g, details.time)
                .replace(/{{total_price}}/g, details.price)
                .replace(/{{booking_link}}/g, details.bookingLink)
                .replace(/{{reschedule_link}}/g, details.rescheduleLink)
                .replace(/{{year}}/g, new Date().getFullYear().toString());

            const mailOptions = {
                from: process.env.FROM_EMAIL || '"Qurux Booking" <noreply@qurux.com>',
                to: toEmail,
                subject: `Booking Confirmed: ${details.serviceName} at ${details.salonName}`,
                html: html,
            };

            await this.transporter.sendMail(mailOptions);
            console.log(`[EmailService] Booking confirmation sent to ${toEmail}`);

        } catch (error) {
            console.error('[EmailService] Error sending email:', error);
        }
    }

    public async sendBookingRejection(toEmail: string, details: BookingDetails): Promise<void> {
        try {
            const templatePath = this.getTemplatePath('booking_rejection.html');
            let html = fs.readFileSync(templatePath, 'utf-8');

            html = html.replace(/{{customer_name}}/g, details.customerName)
                .replace(/{{service_name}}/g, details.serviceName)
                .replace(/{{salon_name}}/g, details.salonName)
                .replace(/{{booking_date}}/g, details.date)
                .replace(/{{booking_time}}/g, details.time)
                .replace(/{{booking_link}}/g, details.bookingLink)
                .replace(/{{year}}/g, new Date().getFullYear().toString());

            const mailOptions = {
                from: process.env.FROM_EMAIL || '"Qurux Booking" <noreply@qurux.com>',
                to: toEmail,
                subject: `Booking Update: ${details.serviceName} at ${details.salonName}`,
                html: html,
            };

            await this.transporter.sendMail(mailOptions);
            console.log(`[EmailService] Booking rejection sent to ${toEmail}`);

        } catch (error) {
            console.error('[EmailService] Error sending rejection email:', error);
        }
    }
}

export const emailService = new EmailService();

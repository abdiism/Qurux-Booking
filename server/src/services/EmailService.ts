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

    private escapeHtml(unsafe: string): string {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    public async sendBookingConfirmation(toEmail: string, details: BookingDetails): Promise<void> {
        try {
            const templatePath = this.getTemplatePath('booking_confirmation.html');
            let html = fs.readFileSync(templatePath, 'utf-8');

            // Sanitize inputs
            const safeDetails = {
                customerName: this.escapeHtml(details.customerName),
                serviceName: this.escapeHtml(details.serviceName),
                salonName: this.escapeHtml(details.salonName),
                salonAddress: this.escapeHtml(details.salonAddress),
                date: this.escapeHtml(details.date),
                time: this.escapeHtml(details.time),
                price: this.escapeHtml(details.price),
                bookingLink: details.bookingLink, // Links typically need careful handling, but usually we trust our own generated links
                rescheduleLink: details.rescheduleLink
            };

            // Replace placeholders
            html = html.replace(/{{customer_name}}/g, safeDetails.customerName)
                .replace(/{{service_name}}/g, safeDetails.serviceName)
                .replace(/{{salon_name}}/g, safeDetails.salonName)
                .replace(/{{salon_address}}/g, safeDetails.salonAddress)
                .replace(/{{booking_date}}/g, safeDetails.date)
                .replace(/{{booking_time}}/g, safeDetails.time)
                .replace(/{{total_price}}/g, safeDetails.price)
                .replace(/{{booking_link}}/g, safeDetails.bookingLink)
                .replace(/{{reschedule_link}}/g, safeDetails.rescheduleLink)
                .replace(/{{year}}/g, new Date().getFullYear().toString());

            const mailOptions = {
                from: process.env.FROM_EMAIL || '"Qurux Booking" <noreply@qurux.com>',
                to: toEmail,
                subject: `Booking Confirmed: ${safeDetails.serviceName} at ${safeDetails.salonName}`,
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

            const safeDetails = {
                customerName: this.escapeHtml(details.customerName),
                serviceName: this.escapeHtml(details.serviceName),
                salonName: this.escapeHtml(details.salonName),
                date: this.escapeHtml(details.date),
                time: this.escapeHtml(details.time),
                bookingLink: details.bookingLink
            };

            html = html.replace(/{{customer_name}}/g, safeDetails.customerName)
                .replace(/{{service_name}}/g, safeDetails.serviceName)
                .replace(/{{salon_name}}/g, safeDetails.salonName)
                .replace(/{{booking_date}}/g, safeDetails.date)
                .replace(/{{booking_time}}/g, safeDetails.time)
                .replace(/{{booking_link}}/g, safeDetails.bookingLink)
                .replace(/{{year}}/g, new Date().getFullYear().toString());

            const mailOptions = {
                from: process.env.FROM_EMAIL || '"Qurux Booking" <noreply@qurux.com>',
                to: toEmail,
                subject: `Booking Update: ${safeDetails.serviceName} at ${safeDetails.salonName}`,
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

import { supabase } from '../lib/supabase';
import { emailService } from '../services/EmailService';

/**
 * Handles the async process of sending booking status update emails.
 * This is designed to be a "fire and forget" operation from the controller's perspective.
 */
export const sendBookingStatusEmail = async (bookingId: string, status: string) => {
    console.log(`[bookingEmailHandler] Starting email notification flow for booking ${bookingId}, Status: ${status}`);
    try {
        // Fetch details separately to be safe from join errors
        const { data: bookingDetails, error: detailError } = await supabase
            .from('bookings')
            .select('customer_id, service_id, salon_id, booking_date, time_slot, total_price, customer_name')
            .eq('id', bookingId)
            .single();

        if (detailError || !bookingDetails) {
            console.error('[bookingEmailHandler] Failed to fetch booking details for email:', detailError);
            return;
        }

        // Fetch Customer Email
        // Strategy 1: Profiles Table
        let customerEmail: string | undefined;
        let customerName = bookingDetails.customer_name || 'Valued Customer';

        const { data: customerProfile } = await supabase
            .from('profiles')
            .select('email, full_name')
            .eq('id', bookingDetails.customer_id)
            .single();

        if (customerProfile?.email) {
            customerEmail = customerProfile.email;
            if (customerProfile.full_name) customerName = customerProfile.full_name;
            console.log('[bookingEmailHandler] Found email in profiles table');
        } else {
            console.warn('[bookingEmailHandler] Profile not found or no email, attempting Auth Admin lookup...');
            // Strategy 2: Auth Admin (Fallback)
            const { data: userData, error: userError } = await supabase.auth.admin.getUserById(bookingDetails.customer_id);
            if (userData?.user?.email) {
                customerEmail = userData.user.email;
                console.log('[bookingEmailHandler] Found email via Auth Admin');
            } else {
                console.error('[bookingEmailHandler] Could not find customer email in Auth either:', userError);
            }
        }

        // Fetch Service & Salon (keep existing logic but add logs)
        const { data: service } = await supabase.from('services').select('name_english').eq('id', bookingDetails.service_id).single();
        const { data: salon } = await supabase.from('salons').select('name, address, city').eq('id', bookingDetails.salon_id).single();

        if (customerEmail) {
            const emailDetails = {
                customerName: customerName,
                serviceName: service?.name_english || 'Service',
                salonName: salon?.name || 'Salon',
                salonAddress: salon ? `${salon.address}, ${salon.city}` : '',
                date: bookingDetails.booking_date,
                time: bookingDetails.time_slot,
                price: `$${bookingDetails.total_price}`,
                bookingLink: 'https://qurux.app/bookings',
                rescheduleLink: 'https://qurux.app/bookings'
            };

            console.log(`[bookingEmailHandler] Sending ${status} email to ${customerEmail}`);

            if (status === 'Confirmed') {
                await emailService.sendBookingConfirmation(customerEmail, emailDetails);
            } else if (status === 'Declined') {
                await emailService.sendBookingRejection(customerEmail, emailDetails);
            }
        } else {
            console.error('[bookingEmailHandler] Aborting email: No recipient email found.');
        }
    } catch (emailError) {
        console.error('[bookingEmailHandler] Failed to send status update email:', emailError);
    }
};

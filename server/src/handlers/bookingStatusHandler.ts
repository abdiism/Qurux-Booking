import { Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { AuthRequest } from '../middleware/auth';
import { sendBookingStatusEmail } from './bookingEmailHandler';

export const updateBookingStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    const dbStatus = status === 'Declined' ? 'Cancelled' : status;

    const { data, error } = await supabase
        .from('bookings')
        .update({ status: dbStatus })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.json(data);

    // Async Email
    sendBookingStatusEmail(id, status).catch(err => {
        console.error('[bookingStatusHandler] Unexpected error in email flow:', err);
    });
};

export const cancelBooking = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const user = req.user;

    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    console.log(`[bookingStatusHandler] Cancelling booking ${id} by user ${user.id}`);

    const { data: booking } = await supabase.from('bookings').select('customer_id').eq('id', id).single();

    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    if (booking.customer_id !== user.id) {
        return res.status(403).json({ error: 'Unauthorized to cancel this booking' });
    }

    const { data, error } = await supabase
        .from('bookings')
        .update({ status: 'Cancelled' })
        .eq('id', id)
        .select();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.json(data);
};

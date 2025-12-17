import { Request, Response } from 'express';
import { supabase } from '../lib/supabase';

export const getAvailability = async (req: Request, res: Response) => {
    const { salonId, date } = req.query;

    if (!salonId || !date) {
        return res.status(400).json({ error: 'Missing salonId or date' });
    }

    // [Fix] Timezone Consistency
    // Treat the incoming date string (e.g., '2025-12-25') as a raw date in standard ISO format.
    // We want to query the database for this specific "Calendar Day" regardless of server time.

    // Create UTC midnight boundaries
    const startOfDay = new Date(String(date));
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(String(date));
    endOfDay.setUTCHours(23, 59, 59, 999);

    const { data, error } = await supabase
        .from('bookings')
        .select('time_slot')
        .eq('salon_id', salonId)
        .in('status', ['Pending', 'Confirmed'])
        .gte('booking_date', startOfDay.toISOString())
        .lte('booking_date', endOfDay.toISOString());

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    const bookedSlots = (data || []).map((b: { time_slot: string }) => b.time_slot);

    res.json(bookedSlots);
};

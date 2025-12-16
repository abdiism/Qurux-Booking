import { Response } from 'express';
import { supabase } from '../lib/supabase';
import { AuthRequest } from '../middleware/auth';

export const getBookings = async (req: AuthRequest, res: Response) => {
    const { role } = req.query;
    const userId = req.user?.id;

    if (!role || !userId) {
        return res.status(400).json({ error: 'Missing role or valid session' });
    }

    let query = supabase.from('bookings').select('*');

    if (role === 'MANAGER') {
        const { data: salons, error: salonError } = await supabase
            .from('salons')
            .select('id')
            .eq('owner_id', userId);

        if (salonError) {
            return res.status(500).json({ error: salonError.message });
        }

        const salonIds = salons.map(s => s.id);

        if (salonIds.length === 0) {
            return res.json([]);
        }

        query = query.in('salon_id', salonIds);
    } else if (role === 'CUSTOMER') {
        query = query.eq('customer_id', userId);
    } else {
        return res.status(400).json({ error: 'Invalid role' });
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    const formattedData = data.map(b => ({
        id: b.id,
        customerId: b.customer_id,
        salonId: b.salon_id,
        serviceId: b.service_id,
        customerName: b.customer_name || 'Unknown',
        date: b.booking_date,
        timeSlot: b.time_slot,
        totalPrice: b.total_price,
        paymentMethod: b.payment_method,
        status: b.status,
        createdAt: b.created_at
    }));

    res.json(formattedData);
};

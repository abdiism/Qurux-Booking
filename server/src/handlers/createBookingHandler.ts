import { Response } from 'express';
import { supabase } from '../lib/supabase';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';

const createBookingSchema = z.object({
    salonId: z.string().uuid(),
    serviceId: z.string().uuid(),
    date: z.string(),
    timeSlot: z.string(),
    totalPrice: z.number().positive(),
    paymentMethod: z.string(),
    customerName: z.string()
});

export const createBooking = async (req: AuthRequest, res: Response) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const validation = createBookingSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({ error: 'Invalid data', details: validation.error.errors });
    }

    const { salonId, serviceId, date, timeSlot, totalPrice, paymentMethod, customerName } = validation.data;

    const { data: service, error: serviceError } = await supabase
        .from('services')
        .select('price, salon_id, name_english')
        .eq('id', serviceId)
        .single();

    if (serviceError || !service) {
        return res.status(400).json({ error: 'Invalid service' });
    }

    const { data: salon } = await supabase
        .from('salons')
        .select('name, address, city')
        .eq('id', salonId)
        .single();

    if (!salon) return res.status(400).json({ error: 'Salon not found' });

    if (service.salon_id !== salonId) {
        return res.status(400).json({ error: 'Service does not belong to this salon' });
    }

    if (totalPrice < service.price) {
        return res.status(400).json({ error: 'Price mismatch' });
    }

    const { data: existing } = await supabase
        .from('bookings')
        .select('id')
        .eq('salon_id', salonId)
        .eq('booking_date', date)
        .eq('time_slot', timeSlot)
        .neq('status', 'Cancelled');

    if (existing && existing.length > 0) {
        return res.status(409).json({ error: 'Slot already booked' });
    }

    const { data, error } = await supabase
        .from('bookings')
        .insert([
            {
                customer_id: user.id,
                salon_id: salonId,
                service_id: serviceId,
                booking_date: date,
                time_slot: timeSlot,
                total_price: totalPrice,
                payment_method: paymentMethod,
                status: 'Pending',
                customer_name: customerName
            }
        ])
        .select();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data);
};

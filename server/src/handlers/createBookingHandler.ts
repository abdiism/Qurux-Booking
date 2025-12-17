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

    // [Fix] Payment Logic Simulation
    // In a real app, this would verify a stripe PaymentIntent
    if (totalPrice > 0) {
        // Mock payment verification
        console.log(`[Payment] Processing payment of $${totalPrice} for ${user.id} via ${paymentMethod}`);
        // If we had a payment provider, we would await their confirmation here.
        // if (!verified) return res.status(402).json({ error: "Payment failed" });
    }

    /* 
       [Fix] Race Condition Strategy:
       We rely on the Database Unique Constraint (added via SQL script).
       If an insert fails with code 23505 (unique_violation), we know it's a double booking.
    */

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
        // Check for Postgres Unique Violation
        if (error.code === '23505') {
            return res.status(409).json({ error: 'Slot already booked' });
        }
        return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data);
};

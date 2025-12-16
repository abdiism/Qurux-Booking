import { Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { z } from 'zod';

const addReviewSchema = z.object({
    salonId: z.string().uuid(),
    userId: z.string().uuid(),
    rating: z.number().min(1).max(5)
});

export const addReview = async (req: Request, res: Response) => {
    const validation = addReviewSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({ error: 'Invalid data', details: validation.error.errors });
    }

    const { salonId, userId, rating } = validation.data;

    const { error } = await supabase
        .from('reviews')
        .insert({
            salon_id: salonId,
            user_id: userId,
            rating: rating
        });

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(201).json({ message: 'Review added successfully' });
};

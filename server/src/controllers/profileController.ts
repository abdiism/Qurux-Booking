import { Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { z } from 'zod';

const updateProfileSchema = z.object({
    full_name: z.string().optional(),
    phone_number: z.string().optional(),
    location: z.string().optional()
});

export const updateProfile = async (req: Request, res: Response) => {
    const { id } = req.params;
    const validation = updateProfileSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({ error: 'Invalid data', details: validation.error.errors });
    }

    const { error } = await supabase
        .from('profiles')
        .update(validation.data)
        .eq('id', id);

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.json({ message: 'Profile updated successfully' });
};

export const getProfile = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.json(data);
};

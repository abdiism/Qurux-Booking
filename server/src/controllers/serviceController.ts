import { Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { z } from 'zod';

export const getAllServices = async (req: Request, res: Response) => {
    const { data, error } = await supabase
        .from('services')
        .select('*, name:name_english, nameSomali:name_somali, nameEnglish:name_english, durationMin:duration_min, salonId:salon_id, iconName:icon_name');

    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.json(data);
};

const createServiceSchema = z.object({
    salonId: z.string(),
    nameSomali: z.string(),
    nameEnglish: z.string(),
    price: z.coerce.number(), // Allow string input and convert
    category: z.enum(['Hair', 'Face', 'Body', 'Nails']),
    durationMin: z.coerce.number(), // Allow string input and convert
    iconName: z.string().optional()
});

export const createService = async (req: Request, res: Response) => {
    // Log body for debugging
    console.log('[serviceController] Creating service with body:', req.body);

    const validation = createServiceSchema.safeParse(req.body);

    if (!validation.success) {
        console.error('[serviceController] Validation error:', validation.error.errors);
        return res.status(400).json({ error: 'Invalid data', details: validation.error.errors });
    }

    const {
        salonId,
        nameSomali,
        nameEnglish,
        price,
        category,
        durationMin,
        iconName
    } = validation.data;

    const { data, error } = await supabase
        .from('services')
        .insert({
            salon_id: salonId,
            name_somali: nameSomali,
            name_english: nameEnglish,
            price,
            category,
            duration_min: durationMin,
            icon_name: iconName || 'Sparkles'
        })
        .select()
        .single();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    // Map back to camelCase for frontend consistency
    const formattedService = {
        ...data,
        nameSomali: data.name_somali,
        nameEnglish: data.name_english,
        durationMin: data.duration_min,
        salonId: data.salon_id,
        iconName: data.icon_name
    };

    res.status(201).json(formattedService);
};

export const deleteService = async (req: Request, res: Response) => {
    const { id } = req.params;

    console.log('[serviceController] Deleting service:', id);

    const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('[serviceController] Error deleting service:', error);
        return res.status(500).json({ error: error.message });
    }

    res.status(204).send();
};

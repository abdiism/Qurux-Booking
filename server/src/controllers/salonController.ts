import { Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { z } from 'zod';

export const getAllSalons = async (req: Request, res: Response) => {
    // Filter out salons that don't have a name (incomplete registration logic)
    const { data, error } = await supabase
        .from('salons')
        .select('*, image:image_url, reviewCount:review_count, ownerId:owner_id, phoneNumber:phone_number, socialLinks:social_links')
        .neq('name', '')
        .not('name', 'is', null);

    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.json(data);
};

const updateSalonSchema = z.object({
    name: z.string().optional(),
    address: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(), // Frontend sends 'image'
    images: z.array(z.string()).optional(),
    city: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    phoneNumber: z.string().optional(),
    socialLinks: z.object({ // Frontend sends 'socialLinks'
        instagram: z.string().optional(),
        tiktok: z.string().optional(),
        facebook: z.string().optional()
    }).optional()
});

export const updateSalon = async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log(`[salonController] Updating salon ${id} with body:`, req.body);
    const validation = updateSalonSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({ error: 'Invalid data', details: validation.error.errors });
    }

    const {
        image,
        socialLinks,
        phoneNumber,
        ...otherFields
    } = validation.data;

    // Map frontend fields to DB columns
    const dbUpdates: any = { ...otherFields };
    if (image !== undefined) dbUpdates.image_url = image;
    if (socialLinks !== undefined) dbUpdates.social_links = socialLinks;
    if (phoneNumber !== undefined) dbUpdates.phone_number = phoneNumber;

    const { data, error } = await supabase
        .from('salons')
        .update(dbUpdates)
        .eq('id', id)
        .select();

    console.log(`[salonController] Supabase update result for ${id}:`, { data, error });

    if (error) {
        console.error('Error updating salon:', error);
        return res.status(500).json({ error: error.message });
    }

    if (!data || data.length === 0) {
        console.error(`[salonController] Update failed: No rows updated for ID ${id}. Possible causes: ID mismatch, RLS policy, or Row deleted.`);
        return res.status(404).json({ error: 'Salon not found or permission denied' });
    }

    console.log(`[salonController] Successfully updated salon ${id}`);
    res.json({ message: 'Salon updated successfully', data });
};

export const createSalon = async (req: Request, res: Response) => {
    // Reuse specific schema or create new one. For now, we'll allow optional fields for flexibility during onboarding.
    // Ideally, name and ownerId are required.
    const createSalonSchema = z.object({
        name: z.string(),
        address: z.string().optional(),
        description: z.string().optional(),
        image: z.string().optional(),
        images: z.array(z.string()).optional(),
        city: z.string().optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        phoneNumber: z.string().optional(),
        socialLinks: z.object({
            instagram: z.string().optional(),
            tiktok: z.string().optional(),
            facebook: z.string().optional()
        }).optional(),
        ownerId: z.string()
    });

    const validation = createSalonSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({ error: 'Invalid data', details: validation.error.errors });
    }

    const {
        image,
        socialLinks,
        phoneNumber,
        ownerId,
        ...otherFields
    } = validation.data;

    // CHECK FOR EXISTING SALON
    const { data: existingSalon } = await supabase
        .from('salons')
        .select('id')
        .eq('owner_id', ownerId)
        .single();

    if (existingSalon) {
        return res.status(409).json({ error: 'A salon already exists for this account. Please login.' });
    }

    const dbInsert = {
        ...otherFields,
        image_url: image || '', // Default to empty or placeholder
        social_links: socialLinks || {},
        phone_number: phoneNumber,
        owner_id: ownerId,
        rating: 5.0, // Default start
        review_count: 0
    };

    const { data, error } = await supabase
        .from('salons')
        .insert(dbInsert)
        .select('*, image:image_url, reviewCount:review_count, ownerId:owner_id, phoneNumber:phone_number, socialLinks:social_links')
        .single();

    if (error) {
        console.error('Error creating salon:', error);
        return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data);
};

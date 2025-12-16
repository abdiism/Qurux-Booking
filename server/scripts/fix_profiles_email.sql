
-- Fix profiles table: Add missing email column and refresh cache

-- 1. Add 'email' column if it's missing
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email TEXT;

-- 2. Force PostgREST to refresh its schema cache
-- This is critical for the API to "see" the new columns immediately
NOTIFY pgrst, 'reload config';

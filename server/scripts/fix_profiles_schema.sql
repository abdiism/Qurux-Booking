
-- Fix profiles table schema
-- This script adds potentially missing columns that are required for registration

-- 1. Add 'role' column (default to CUSTOMER)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'CUSTOMER';

-- 2. Add 'full_name' column
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS full_name TEXT;

-- 3. Add 'phone_number' column
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone_number TEXT;

-- 4. Add 'location' column (optional, but good to have)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS location TEXT;

-- 5. Verify constraints (optional)
-- Ensure id references auth.users
-- ALTER TABLE public.profiles 
-- ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

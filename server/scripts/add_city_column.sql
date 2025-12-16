-- Add missing 'city' column to salons table
ALTER TABLE salons ADD COLUMN IF NOT EXISTS city TEXT;

-- Refresh schema cache (Supabase usually does this automatically, but good to trigger)
NOTIFY pgrst, 'reload config';

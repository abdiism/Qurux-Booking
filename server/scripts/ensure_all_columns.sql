-- Ensure ALL potential missing columns exist in 'salons' table
ALTER TABLE salons ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS social_links JSONB;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS latitude FLOAT;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS longitude FLOAT;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE salons ADD COLUMN IF NOT EXISTS images TEXT[];

-- Ensure 'bookings' has customer_name
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS customer_name TEXT;

-- Refresh schema cache
NOTIFY pgrst, 'reload config';

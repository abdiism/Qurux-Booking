-- [Fix] Race Condition: Prevent double bookings
-- We add a unique constraint on (salon_id, booking_date, time_slot)
-- ensuring that for a given salon, date, and time, only one booking can exist (unless cancelled).

-- First, we might need to clean up duplicates if any exist (Optional, assumes clean state or manual fix required if fails)
-- ALTER TABLE bookings ADD CONSTRAINT unique_booking_slot UNIQUE (salon_id, booking_date, time_slot);
-- However, we only care about Active bookings. Pending or Confirmed. 
-- Postgres allows partial indices for unique constraints.

CREATE UNIQUE INDEX unique_active_booking 
ON bookings (salon_id, booking_date, time_slot) 
WHERE status != 'Cancelled';


-- [Fix] Security: Restrict File Uploads
-- We need to update the policy to check for mime-type and size.

-- Drop existing upload policy
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;

-- Re-create with stricter checks
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'salon-images' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] != 'private' -- Optional structure check
  AND LOWER(storage.extension(name)) IN ('jpg', 'jpeg', 'png', 'webp', 'avif') -- Extension check
  -- Note: Mime type check relies on the client sending correct mime type, but extension is a good fallback proxy
);

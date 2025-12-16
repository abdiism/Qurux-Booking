DO $$
DECLARE
    r RECORD;
    keep_id UUID;
BEGIN
    -- Loop through all salon names that have duplicates
    FOR r IN 
        SELECT name FROM salons GROUP BY name HAVING count(*) > 1
    LOOP
        -- Get the ID to keep (the oldest one)
        SELECT id INTO keep_id FROM salons WHERE name = r.name ORDER BY created_at ASC LIMIT 1;
        
        RAISE NOTICE 'Merging duplicates for salon: %, keeping ID: %', r.name, keep_id;

        -- 1. Reassign Bookings
        UPDATE bookings 
        SET salon_id = keep_id 
        WHERE salon_id IN (SELECT id FROM salons WHERE name = r.name AND id != keep_id);

        -- 2. Reassign Services
        UPDATE services 
        SET salon_id = keep_id 
        WHERE salon_id IN (SELECT id FROM salons WHERE name = r.name AND id != keep_id);

        -- 3. Delete the duplicate salons
        DELETE FROM salons 
        WHERE name = r.name AND id != keep_id;
        
    END LOOP;
END $$;

-- Also re-apply permissions just in case
DROP POLICY IF EXISTS "Managers can update their own salon" ON salons;
CREATE POLICY "Managers can update their own salon" ON salons FOR UPDATE USING ( auth.uid() = owner_id );

DROP POLICY IF EXISTS "Customers can update their own bookings" ON bookings;
CREATE POLICY "Customers can update their own bookings" ON bookings FOR UPDATE USING ( auth.uid() = customer_id );

-- Ensure columns exist
ALTER TABLE salons ADD COLUMN IF NOT EXISTS phone_number TEXT;

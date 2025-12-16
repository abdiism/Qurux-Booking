-- 1. Fix Permissions (RLS) - CRITICAL for updates and cancellations
-- Allow Managers to update their own salon
DROP POLICY IF EXISTS "Managers can update their own salon" ON salons;
CREATE POLICY "Managers can update their own salon"
ON salons FOR UPDATE
USING ( auth.uid() = owner_id );

-- Allow Customers to update (cancel) their own bookings
DROP POLICY IF EXISTS "Customers can update their own bookings" ON bookings;
CREATE POLICY "Customers can update their own bookings"
ON bookings FOR UPDATE
USING ( auth.uid() = customer_id );

-- 2. Handle Duplicates (Reassign Data First to avoid Foreign Key Errors)

-- Step A: Reassign Bookings from duplicate salons to the 'original' (oldest) salon
UPDATE bookings
SET salon_id = sub.min_id
FROM (
    SELECT name, min(id) as min_id
    FROM salons
    GROUP BY name
) sub
JOIN salons s ON s.name = sub.name
WHERE bookings.salon_id = s.id
AND bookings.salon_id != sub.min_id;

-- Step B: Reassign Services from duplicate salons to the 'original' salon
UPDATE services
SET salon_id = sub.min_id
FROM (
    SELECT name, min(id) as min_id
    FROM salons
    GROUP BY name
) sub
JOIN salons s ON s.name = sub.name
WHERE services.salon_id = s.id
AND services.salon_id != sub.min_id;

-- Step C: Now it is safe to delete the duplicate salons
DELETE FROM salons
WHERE id NOT IN (
    SELECT min(id)
    FROM salons
    GROUP BY name
);

-- 3. Ensure Columns Exist (Just in case)
ALTER TABLE salons ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location TEXT;

-- 4. Grant Permissions
GRANT ALL ON salons TO authenticated;
GRANT ALL ON bookings TO authenticated;

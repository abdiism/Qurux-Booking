-- 1. Fix Permissions (RLS)
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

-- 2. Remove Duplicate Salons (The ones with NO bookings)
DELETE FROM salons
WHERE id IN (
    SELECT s.id
    FROM salons s
    -- Check if it is a duplicate (another salon exists with the same name)
    WHERE EXISTS (
        SELECT 1 FROM salons other 
        WHERE other.name = s.name 
        AND other.id != s.id
    )
    -- AND check if it has NO bookings
    AND NOT EXISTS (
        SELECT 1 FROM bookings b 
        WHERE b.salon_id = s.id
    )
);

-- 3. Ensure Columns Exist
ALTER TABLE salons ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location TEXT;

-- 4. Grant Permissions
GRANT ALL ON salons TO authenticated;
GRANT ALL ON bookings TO authenticated;

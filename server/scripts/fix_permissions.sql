-- 1. Fix Permissions for Salons (Allow Managers to Update)
-- First, drop existing policy if it exists to avoid conflicts (or just create a new one)
DROP POLICY IF EXISTS "Managers can update their own salon" ON salons;
CREATE POLICY "Managers can update their own salon"
ON salons FOR UPDATE
USING ( auth.uid() = owner_id );

-- 2. Fix Permissions for Bookings (Allow Customers to Cancel)
DROP POLICY IF EXISTS "Customers can update their own bookings" ON bookings;
CREATE POLICY "Customers can update their own bookings"
ON bookings FOR UPDATE
USING ( auth.uid() = customer_id );

-- 3. Remove Duplicate Salons
-- Keep the most recently updated one, delete others with the same name
DELETE FROM salons a USING salons b
WHERE a.id < b.id AND a.name = b.name;

-- 4. Ensure RLS is enabled
ALTER TABLE salons ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- 5. Grant permissions to authenticated users (if not already)
GRANT ALL ON salons TO authenticated;
GRANT ALL ON bookings TO authenticated;

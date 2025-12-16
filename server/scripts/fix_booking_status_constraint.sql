-- Fix Booking Status Constraint
-- 1. Drop the old constraint
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;

-- 2. Add new constraint with all required statuses (Title Case to match App)
ALTER TABLE bookings ADD CONSTRAINT bookings_status_check 
CHECK (status IN ('Pending', 'Confirmed', 'Cancelled', 'Completed', 'Declined', 'pending', 'confirmed', 'cancelled', 'completed', 'declined'));

-- 3. Update any existing invalid statuses if necessary (optional, but good for cleanup)
-- UPDATE bookings SET status = 'Cancelled' WHERE status = 'cancelled';
-- UPDATE bookings SET status = 'Pending' WHERE status = 'pending';

NOTIFY pgrst, 'reload config';

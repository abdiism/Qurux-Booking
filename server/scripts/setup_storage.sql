-- Create the storage bucket for salon images
INSERT INTO storage.buckets (id, name, public)
VALUES ('salon-images', 'salon-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to view images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'salon-images' );

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'salon-images' AND auth.role() = 'authenticated' );

-- Allow users to update their own images (optional, for now just insert)
CREATE POLICY "Authenticated Update"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'salon-images' AND auth.role() = 'authenticated' );

-- Allow users to delete their own images
CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'salon-images' AND auth.role() = 'authenticated' );

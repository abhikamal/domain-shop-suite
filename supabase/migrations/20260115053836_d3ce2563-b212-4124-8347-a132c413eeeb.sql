-- Add RLS policies for product-images storage bucket
-- Note: The bucket already exists and is public (for viewing)

-- Enable RLS on storage.objects if not already enabled
-- (storage.objects has RLS enabled by default in Supabase)

-- Policy: Allow authenticated users to upload to product-images bucket
CREATE POLICY "Users can upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- Policy: Allow users to update their own uploaded files
CREATE POLICY "Users can update own product images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images' AND owner = auth.uid())
WITH CHECK (bucket_id = 'product-images' AND owner = auth.uid());

-- Policy: Allow users to delete their own uploaded files
CREATE POLICY "Users can delete own product images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images' AND owner = auth.uid());

-- Policy: Allow public read access to product images (marketplace needs this)
CREATE POLICY "Public can view product images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');
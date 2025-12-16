-- Create product_images table for multiple images per product
CREATE TABLE public.product_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- Anyone can view product images
CREATE POLICY "Anyone can view product images"
ON public.product_images
FOR SELECT
USING (true);

-- Sellers can manage their product images
CREATE POLICY "Sellers can manage own product images"
ON public.product_images
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.products 
    WHERE products.id = product_images.product_id 
    AND products.seller_id = auth.uid()
  )
);

-- Admins can manage all product images
CREATE POLICY "Admins can manage all product images"
ON public.product_images
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));
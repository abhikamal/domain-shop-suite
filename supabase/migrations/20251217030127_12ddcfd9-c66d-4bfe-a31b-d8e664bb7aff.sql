-- Drop existing restrictive policies on products
DROP POLICY IF EXISTS "Admins can manage all products" ON public.products;
DROP POLICY IF EXISTS "Non-banned users can view available products" ON public.products;
DROP POLICY IF EXISTS "Sellers can manage own products" ON public.products;

-- Recreate as PERMISSIVE policies (default behavior)
CREATE POLICY "Anyone can view available products"
ON public.products
FOR SELECT
USING (is_available = true);

CREATE POLICY "Sellers can manage own products"
ON public.products
FOR ALL
USING (auth.uid() = seller_id)
WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Admins can manage all products"
ON public.products
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
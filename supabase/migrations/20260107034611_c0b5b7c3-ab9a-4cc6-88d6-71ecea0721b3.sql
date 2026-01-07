-- Create activity_logs table
CREATE TABLE public.activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  activity_type TEXT NOT NULL,
  activity_description TEXT,
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Only super admins can view activity logs
CREATE POLICY "Super admins can view all activity logs"
ON public.activity_logs
FOR SELECT
USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Allow authenticated users to insert their own logs
CREATE POLICY "Authenticated users create own logs"
ON public.activity_logs
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create indexes for faster queries
CREATE INDEX idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON public.activity_logs(created_at DESC);
CREATE INDEX idx_activity_logs_activity_type ON public.activity_logs(activity_type);

-- Assign super_admin role to Bhavanasi Abhinav
INSERT INTO public.user_roles (user_id, role)
VALUES ('0af3017e-0a27-47a4-9e2e-ddefe6d8650e', 'super_admin')
ON CONFLICT (user_id, role) DO NOTHING;
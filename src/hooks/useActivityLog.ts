import { supabase } from '@/integrations/supabase/client';

type ActivityType = 
  | 'login' 
  | 'logout' 
  | 'signup' 
  | 'view_product' 
  | 'add_to_cart' 
  | 'place_order' 
  | 'update_profile'
  | 'sell_product'
  | 'admin_action';

interface LogActivityParams {
  userId: string;
  activityType: ActivityType;
  description?: string;
  metadata?: Record<string, unknown>;
}

export const logActivity = async ({
  userId,
  activityType,
  description,
  metadata = {}
}: LogActivityParams) => {
  try {
    // Get IP from a free API (best effort, may be blocked)
    let ipAddress = 'unknown';
    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      ipAddress = ipData.ip || 'unknown';
    } catch {
      // IP fetch failed, continue with unknown
    }

    const userAgent = navigator.userAgent || 'unknown';

    await supabase.from('activity_logs' as const).insert({
      user_id: userId,
      activity_type: activityType,
      activity_description: description || null,
      ip_address: ipAddress,
      user_agent: userAgent,
      metadata: metadata as Record<string, unknown>
    } as never);
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};

export const useActivityLog = () => {
  return { logActivity };
};

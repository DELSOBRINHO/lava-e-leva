import { supabase } from '../lib/supabaseClient';

export async function getLaundries() {
  const { data, error } = await supabase
    .from('laundries')
    .select('id, name, logo_url, address, created_at, owner_id, profiles(rating)')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map((laundry: any) => ({
    ...laundry,
    rating: laundry.profiles?.rating ?? null,
  }));
}

export async function getServicesByLaundry(laundryId: string) {
  const { data, error } = await supabase
    .from('services')
    .select('id, name, description, price, duration_hours')
    .eq('laundry_id', laundryId)
    .eq('is_available', true)
    .order('name');
  if (error) throw error;
  return data;
} 
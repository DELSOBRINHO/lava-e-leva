import { useEffect } from 'react';
import { supabase } from '../supabaseClient';

export async function ensureProfile(user, role = 'customer', name = '', address = {}) {
  if (!user) return;
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (!profile) {
    await supabase.from('profiles').insert([
      {
        user_id: user.id,
        name: name || user.email,
        role,
        address,
      }
    ]);
  }
}

export function useEnsureProfile(user, role = 'customer', name = '', address = {}) {
  useEffect(() => {
    if (user) {
      ensureProfile(user, role, name, address);
    }
  }, [user, role, name, address]);
} 
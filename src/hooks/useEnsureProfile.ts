import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export async function ensureProfile(user: any, role = 'customer', name = '', address = {}) {
  if (!user) return;
  const { data: profile, error: selectError } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (selectError) {
    console.error('Erro ao buscar perfil:', selectError);
    return;
  }

  if (!profile) {
    const { error: insertError } = await supabase.from('profiles').insert([
      {
        user_id: user.id,
        name: name || user.email,
        role,
        address,
      }
    ]);
    if (insertError) {
      console.error('Erro ao criar perfil:', insertError);
    } else {
      console.log('Perfil criado com sucesso!');
    }
  }
}

export function useEnsureProfile(user: any, role = 'customer', name = '', address = {}) {
  useEffect(() => {
    if (user) {
      ensureProfile(user, role, name, address);
    }
  }, [user, role, name, address]);
} 
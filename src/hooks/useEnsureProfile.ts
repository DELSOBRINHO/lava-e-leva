import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export async function ensureProfile(user: any, role = 'customer', name = '', address = {}) {
  if (!user) {
    console.warn('Usuário não autenticado ao tentar criar perfil.');
    return;
  }

  // Obtenha o UID autenticado do Supabase
  const session = await supabase.auth.getSession();
  const authUid = session.data.session?.user?.id;
  console.log('ensureProfile: user.id =', user.id, '| auth.uid() =', authUid);

  if (user.id !== authUid) {
    console.warn('Tentativa de criar perfil com user_id diferente do usuário autenticado. Operação abortada.');
    return;
  }

  const { data: profile, error: selectError } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (selectError && selectError.code !== 'PGRST116') { // PGRST116 = no rows found
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
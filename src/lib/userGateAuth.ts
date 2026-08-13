import { isSupabaseConfigured, supabase } from './supabase';
import type { UserProfile } from './userProfile';

export type UserGateForm = {
  name: string;
  surname: string;
  nickname: string;
  email: string;
  phone: string;
  password: string;
};

export function buildLocalProfile(form: UserGateForm): UserProfile {
  return {
    name: form.name.trim(),
    surname: form.surname.trim(),
    nickname: form.nickname.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    provider: 'local',
  };
}

export async function signUpWithEmail(form: UserGateForm) {
  const profile = buildLocalProfile(form);
  if (!isSupabaseConfigured) return { profile, error: '' };

  const { error } = await supabase.auth.signUp({
    email: profile.email ?? '',
    password: form.password,
    options: { data: profile },
  });

  return { profile, error: error?.message ?? '' };
}

export async function signInWithEmail(email: string, password: string) {
  if (!isSupabaseConfigured) return { profile: null, error: 'not-registered' };

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return { profile: null, error: 'not-registered' };

  return {
    profile: {
      name: getMetadata(data.user, 'name') || getMetadata(data.user, 'full_name') || email.split('@')[0],
      surname: getMetadata(data.user, 'surname'),
      nickname: getMetadata(data.user, 'nickname') || email.split('@')[0],
      email,
      phone: getMetadata(data.user, 'phone'),
      provider: 'local' as const,
    },
    error: '',
  };
}

function getMetadata(user: { user_metadata: Record<string, unknown> }, key: string) {
  const value = user.user_metadata[key];
  return typeof value === 'string' ? value : '';
}

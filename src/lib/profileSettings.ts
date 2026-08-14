import { isSupabaseConfigured, supabase } from './supabase';
import type { UserProfile } from './userProfile';

export type ProfileUpdate = Pick<UserProfile, 'name' | 'surname' | 'nickname' | 'phone' | 'avatarUrl'>;

export async function updateAuthProfile(profile: ProfileUpdate) {
  if (!isSupabaseConfigured) return '';

  const { error } = await supabase.auth.updateUser({
    data: {
      name: profile.name,
      surname: profile.surname ?? '',
      nickname: profile.nickname,
      phone: profile.phone ?? '',
      avatar_url: profile.avatarUrl ?? '',
    },
  });

  return error?.message ?? '';
}

export async function changeUserPassword(currentPassword: string, newPassword: string) {
  if (!isSupabaseConfigured) return 'Supabase is not configured.';

  const { data } = await supabase.auth.getUser();
  const email = data.user?.email;
  if (!email) return 'Email user session was not found.';

  const check = await supabase.auth.signInWithPassword({ email, password: currentPassword });
  if (check.error) return 'Current password is incorrect.';

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  return error?.message ?? '';
}

export async function sendPasswordReset(email: string) {
  if (!isSupabaseConfigured) return 'Supabase is not configured.';
  if (!email) return 'Email user session was not found.';

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/profile`,
  });
  return error?.message ?? '';
}

export async function uploadProfileAvatar(file: File) {
  if (!isSupabaseConfigured) return { url: '', error: 'Supabase is not configured.' };

  const { data } = await supabase.auth.getUser();
  const userId = data.user?.id;
  if (!userId) return { url: '', error: 'User session was not found.' };

  const extension = file.name.split('.').pop() || 'jpg';
  const path = `${userId}/avatar.${extension}`;
  const upload = await supabase.storage.from('profile-avatars').upload(path, file, { upsert: true });
  if (upload.error) return { url: '', error: upload.error.message };

  const { data: publicUrl } = supabase.storage.from('profile-avatars').getPublicUrl(path);
  return { url: publicUrl.publicUrl, error: '' };
}

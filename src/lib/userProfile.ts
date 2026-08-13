import type { User } from '@supabase/supabase-js';

export type UserProfile = {
  name: string;
  surname?: string;
  nickname: string;
  email?: string;
  phone?: string;
  provider?: 'local' | 'google';
};

const profileKey = 'aerospace-user-profile';

export function loadUserProfile() {
  try {
    const stored = localStorage.getItem(profileKey);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as Partial<UserProfile>;
    if (!parsed.name || !parsed.nickname) return null;

    return {
      name: parsed.name,
      surname: parsed.surname,
      nickname: parsed.nickname,
      email: parsed.email,
      phone: parsed.phone,
      provider: parsed.provider,
    };
  } catch {
    return null;
  }
}

export function saveUserProfile(profile: UserProfile) {
  localStorage.setItem(profileKey, JSON.stringify(profile));
}

export function clearUserProfile() {
  localStorage.removeItem(profileKey);
}

export function buildAuthProfile(user: User): UserProfile {
  const email = user.email ?? '';
  const displayName = getStringMetadata(user, 'full_name') || getStringMetadata(user, 'name') || email.split('@')[0] || 'Google User';
  const nickname = getStringMetadata(user, 'nickname') || email.split('@')[0] || displayName.toLowerCase().replace(/\s+/g, '');

  return {
    name: displayName,
    surname: getStringMetadata(user, 'surname'),
    nickname,
    email,
    phone: getStringMetadata(user, 'phone'),
    provider: user.app_metadata.provider === 'google' ? 'google' : 'local',
  };
}

function getStringMetadata(user: User, key: string) {
  const value = user.user_metadata[key];
  return typeof value === 'string' ? value : '';
}

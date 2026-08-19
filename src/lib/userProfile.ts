import type { User } from '@supabase/supabase-js';

export type UserProfile = {
  name: string;
  surname?: string;
  nickname: string;
  email?: string;
  phone?: string;
  provider?: 'local' | 'google';
  subscription?: SubscriptionPlan;
  avatarUrl?: string;
};

export type SubscriptionPlan = 'free' | 'pro' | 'trial';

const profileKey = 'aerospace-user-profile';
const sessionProfileKey = 'aerospace-session-profile';

export function loadUserProfile() {
  try {
    const savedProfile = localStorage.getItem(profileKey);
    if (savedProfile) {
      const parsed = parseProfile(savedProfile);
      if (parsed?.nickname !== 'guest') return parsed;
      localStorage.removeItem(profileKey);
    }

    const sessionProfile = sessionStorage.getItem(sessionProfileKey);
    if (!sessionProfile) return null;

    return parseProfile(sessionProfile);
  } catch {
    return null;
  }
}

function parseProfile(stored: string) {
  try {
    const parsed = JSON.parse(stored) as Partial<UserProfile>;
    if (!parsed.name || !parsed.nickname) return null;

    return {
      name: parsed.name,
      surname: parsed.surname,
      nickname: parsed.nickname,
      email: parsed.email,
      phone: parsed.phone,
      provider: parsed.provider,
      subscription: getSubscription(parsed.subscription),
      avatarUrl: parsed.avatarUrl,
    };
  } catch {
    return null;
  }
}

export function saveUserProfile(profile: UserProfile) {
  localStorage.setItem(profileKey, JSON.stringify(profile));
}

export function saveSessionUserProfile(profile: UserProfile) {
  sessionStorage.setItem(sessionProfileKey, JSON.stringify(profile));
}

export function clearUserProfile() {
  localStorage.removeItem(profileKey);
  sessionStorage.removeItem(sessionProfileKey);
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
    subscription: getSubscription(getStringMetadata(user, 'subscription')),
    avatarUrl: getStringMetadata(user, 'avatar_url') || getStringMetadata(user, 'picture'),
  };
}

function getStringMetadata(user: User, key: string) {
  const value = user.user_metadata[key];
  return typeof value === 'string' ? value : '';
}

function getSubscription(value: unknown): SubscriptionPlan {
  return value === 'pro' || value === 'trial' ? value : 'free';
}

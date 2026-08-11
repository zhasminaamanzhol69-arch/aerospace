export type UserProfile = {
  name: string;
  nickname: string;
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
      nickname: parsed.nickname,
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

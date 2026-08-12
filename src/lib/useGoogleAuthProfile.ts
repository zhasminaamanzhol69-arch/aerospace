import { useEffect } from 'react';
import { isSupabaseConfigured, supabase } from './supabase';
import { buildAuthProfile, saveUserProfile, type UserProfile } from './userProfile';

export function useGoogleAuthProfile(onProfile: (profile: UserProfile) => void) {
  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;

    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user;
      if (!user) return;
      const nextProfile = buildAuthProfile(user);
      saveUserProfile(nextProfile);
      onProfile(nextProfile);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) return;
      const nextProfile = buildAuthProfile(session.user);
      saveUserProfile(nextProfile);
      onProfile(nextProfile);
    });

    return () => data.subscription.unsubscribe();
  }, [onProfile]);
}

import { useState } from 'react';
import { Link } from 'wouter';
import { LanguageSelector } from '../components/LanguageSelector';
import { ProfileAvatarUploader } from '../components/ProfileAvatarUploader';
import { ProfileDetailsForm } from '../components/ProfileDetailsForm';
import { ProfilePasswordForm } from '../components/ProfilePasswordForm';
import { ProfileSubscriptionCard } from '../components/ProfileSubscriptionCard';
import { SiteMenu } from '../components/SiteMenu';
import { UserGate } from '../components/UserGate';
import {
  changeUserPassword,
  updateAuthProfile,
  uploadProfileAvatar,
} from '../lib/profileSettings';
import { useLanguage } from '../lib/language';
import { profilePageText } from '../lib/profilePageText';
import { loadUserProfile, saveUserProfile, type UserProfile } from '../lib/userProfile';
import './ProfilePage.css';

export function ProfilePage() {
  const { language } = useLanguage();
  const [profile, setProfile] = useState<UserProfile | null>(() => loadUserProfile());
  const copy = profilePageText[language];

  async function handleDetailsSave(nextProfile: UserProfile) {
    const error = await updateAuthProfile(nextProfile);
    if (error) return error;
    saveUserProfile(nextProfile);
    setProfile(nextProfile);
    return copy.saved;
  }

  function handleAuthComplete(nextProfile: UserProfile) {
    saveUserProfile(nextProfile);
    setProfile(nextProfile);
  }

  async function handleAvatarUpload(file: File) {
    const result = await uploadProfileAvatar(file);
    if (result.error || !profile) return result.error || copy.avatar.error;
    const nextProfile = { ...profile, avatarUrl: result.url };
    const error = await updateAuthProfile(nextProfile);
    if (error) return error;
    saveUserProfile(nextProfile);
    setProfile(nextProfile);
    return copy.saved;
  }

  return (
    <main className="container profile-page">
      <div className="top-bar">
        <SiteMenu />
        <LanguageSelector />
      </div>
      {!profile ? (
        <UserGate onComplete={handleAuthComplete} />
      ) : (
        <>
          <header className="profile-page__header">
            <div>
              <p className="eyebrow">Aerospace Account</p>
              <h1>{copy.title}</h1>
              <p>{copy.subtitle}</p>
            </div>
            <Link href="/">{copy.back}</Link>
          </header>
          <div className="profile-page__grid">
            <ProfileAvatarUploader labels={copy.avatar} profile={profile} onUpload={handleAvatarUpload} />
            <ProfileDetailsForm labels={copy.details} profile={profile} onSave={handleDetailsSave} />
            <ProfilePasswordForm
              canChange={profile.provider !== 'google' && Boolean(profile.email)}
              email={profile.email}
              phone={profile.phone}
              labels={copy.password}
              onChangePassword={changeUserPassword}
            />
            <ProfileSubscriptionCard labels={copy.subscription} plan={profile.subscription ?? 'free'} />
          </div>
        </>
      )}
    </main>
  );
}

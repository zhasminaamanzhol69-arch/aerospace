import { useState } from 'react';
import type { UserProfile } from '../lib/userProfile';

export type ProfileAvatarLabels = {
  upload: string;
  error: string;
};

type Props = {
  labels: ProfileAvatarLabels;
  profile: UserProfile;
  onUpload: (file: File) => Promise<string>;
};

export function ProfileAvatarUploader({ labels, profile, onUpload }: Props) {
  const [message, setMessage] = useState('');
  const initial = profile.name.trim().charAt(0).toUpperCase() || 'A';

  async function handleChange(file: File | undefined) {
    if (!file) return;
    setMessage(await onUpload(file));
  }

  return (
    <section className="profile-avatar">
      <div className="profile-avatar__image">
        {profile.avatarUrl ? <img alt="" src={profile.avatarUrl} /> : <span>{initial}</span>}
      </div>
      <label className="profile-avatar__button">
        <span aria-hidden="true">+</span>
        {labels.upload}
        <input accept="image/*" onChange={(event) => handleChange(event.target.files?.[0])} type="file" />
      </label>
      {message && <p className="profile-page__message">{message}</p>}
    </section>
  );
}

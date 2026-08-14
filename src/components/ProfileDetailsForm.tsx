import { useState } from 'react';
import type { UserProfile } from '../lib/userProfile';

export type ProfileDetailsLabels = {
  name: string;
  surname: string;
  nickname: string;
  phone: string;
  save: string;
};

type Props = {
  labels: ProfileDetailsLabels;
  profile: UserProfile;
  onSave: (profile: UserProfile) => Promise<string>;
};

export function ProfileDetailsForm({ labels, profile, onSave }: Props) {
  const [form, setForm] = useState({
    name: profile.name,
    surname: profile.surname ?? '',
    nickname: profile.nickname,
    phone: profile.phone ?? '',
  });
  const [message, setMessage] = useState('');

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSave() {
    setMessage('');
    if (!form.name.trim() || !form.nickname.trim()) return;
    const error = await onSave({ ...profile, ...form });
    setMessage(error);
  }

  return (
    <section className="profile-card">
      <label>
        <span>{labels.name}</span>
        <input value={form.name} onChange={(event) => update('name', event.target.value)} />
      </label>
      <label>
        <span>{labels.surname}</span>
        <input value={form.surname} onChange={(event) => update('surname', event.target.value)} />
      </label>
      <label>
        <span>{labels.nickname}</span>
        <input value={form.nickname} onChange={(event) => update('nickname', event.target.value)} />
      </label>
      <label>
        <span>{labels.phone}</span>
        <input value={form.phone} onChange={(event) => update('phone', event.target.value)} type="tel" />
      </label>
      {message && <p className="profile-page__message">{message}</p>}
      <button onClick={handleSave} type="button">{labels.save}</button>
    </section>
  );
}

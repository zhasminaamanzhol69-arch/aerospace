import { useState } from 'react';

export type ProfilePasswordLabels = {
  change: string;
  forgot: string;
  restoreEmail: string;
  restorePhone: string;
  current: string;
  next: string;
  repeat: string;
  save: string;
  locked: string;
  mismatch: string;
  short: string;
  success: string;
  codeEmailSent: string;
  codePhoneSent: string;
  noEmail: string;
  noPhone: string;
};

type Props = {
  labels: ProfilePasswordLabels;
  canChange: boolean;
  email?: string;
  phone?: string;
  onChangePassword: (currentPassword: string, newPassword: string) => Promise<string>;
};

export function ProfilePasswordForm({ labels, canChange, email, phone, onChangePassword }: Props) {
  const [isChangeOpen, setIsChangeOpen] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [message, setMessage] = useState('');

  async function handleSave() {
    if (!canChange) {
      setMessage(labels.locked);
      return;
    }
    if (newPassword.length < 6) {
      setMessage(labels.short);
      return;
    }
    if (newPassword !== repeatPassword) {
      setMessage(labels.mismatch);
      return;
    }
    const error = await onChangePassword(currentPassword, newPassword);
    setMessage(error || labels.success);
  }

  function handleForgot(method: 'email' | 'phone') {
    if (method === 'email') {
      setMessage(email ? labels.codeEmailSent : labels.noEmail);
      return;
    }
    setMessage(phone ? labels.codePhoneSent : labels.noPhone);
  }

  return (
    <section className="profile-card">
      <button onClick={() => setIsChangeOpen((open) => !open)} type="button">
        {labels.change}
      </button>
      {isChangeOpen && (
        <>
          <label>
            <span>{labels.current}</span>
            <input value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} type="password" />
          </label>
          <label>
            <span>{labels.next}</span>
            <input value={newPassword} onChange={(event) => setNewPassword(event.target.value)} type="password" />
          </label>
          <label>
            <span>{labels.repeat}</span>
            <input value={repeatPassword} onChange={(event) => setRepeatPassword(event.target.value)} type="password" />
          </label>
          <button onClick={handleSave} type="button">{labels.save}</button>
        </>
      )}
      <button className="ghost profile-card__forgot" onClick={() => setIsForgotOpen((open) => !open)} type="button">
        {labels.forgot}
      </button>
      {isForgotOpen && (
        <div className="profile-card__restore">
          <button className="ghost" onClick={() => handleForgot('email')} type="button">
            {labels.restoreEmail}
          </button>
          <button className="ghost" onClick={() => handleForgot('phone')} type="button">
            {labels.restorePhone}
          </button>
        </div>
      )}
      {message && <p className="profile-page__message">{message}</p>}
    </section>
  );
}

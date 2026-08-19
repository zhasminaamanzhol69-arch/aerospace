import { useState } from 'react';
import { useLanguage } from '../lib/language';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { buildLocalProfile, signInWithEmail, signUpWithEmail, type UserGateForm } from '../lib/userGateAuth';
import { userGateText, type AuthMode } from '../lib/userGateText';
import type { UserProfile } from '../lib/userProfile';
import './UserGate.css';

type Props = { onComplete: (profile: UserProfile) => void };

const initialForm: UserGateForm = { name: '', surname: '', nickname: '', email: '', phone: '', password: '' };

export function UserGate({ onComplete }: Props) {
  const { language } = useLanguage();
  const [mode, setMode] = useState<AuthMode>('signup');
  const [form, setForm] = useState<UserGateForm>(initialForm);
  const [error, setError] = useState('');
  const copy = userGateText[language];

  function update(field: keyof UserGateForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleEmailAuth() {
    setError('');
    if (mode === 'signup') {
      await handleSignup();
      return;
    }
    await handleLogin();
  }

  async function handleSignup() {
    const profile = buildLocalProfile(form);
    if (!profile.name || !profile.surname || !profile.nickname || !profile.email || form.password.length < 6) {
      setError(copy.signupError);
      return;
    }
    const result = await signUpWithEmail(form);
    if (result.error) setError(result.error);
    else onComplete(result.profile);
  }

  async function handleLogin() {
    const email = form.email.trim();
    if (!email || form.password.length < 6) {
      setError(copy.loginError);
      return;
    }
    const result = await signInWithEmail(email, form.password);
    if (result.error || !result.profile) setError(copy.notRegistered);
    else onComplete(result.profile);
  }

  async function handleGoogleLogin() {
    if (!isSupabaseConfigured) {
      setError(copy.googleError);
      return;
    }
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (authError) setError(authError.message.toLowerCase().includes('unsupported provider') ? copy.googleDisabled : authError.message);
  }

  function handleGuestLogin() {
    onComplete({
      name: language === 'kk' ? 'Қонақ' : language === 'en' ? 'Guest' : 'Гость',
      nickname: 'guest',
      provider: 'local',
    });
  }

  return (
    <section className="user-gate">
      <div className="card user-gate__card">
        <p className="eyebrow">Aerospace Access</p>
        <h1>{copy.title[mode]}</h1>
        <p>{copy.subtitle[mode]}</p>
        <div className="user-gate__mode">
          <button className={mode === 'login' ? 'is-active' : ''} type="button" onClick={() => setMode('login')}>{copy.login}</button>
          <button className={mode === 'signup' ? 'is-active' : ''} type="button" onClick={() => setMode('signup')}>{copy.signup}</button>
        </div>
        {mode === 'signup' && <SignupFields copy={copy} form={form} update={update} />}
        <Input label={copy.email} value={form.email} onChange={(value) => update('email', value)} type="email" />
        <Input label={copy.password} value={form.password} onChange={(value) => update('password', value)} type="password" />
        {error && <p className="message">{error}</p>}
        <button className="user-gate__google" type="button" onClick={handleGoogleLogin}>
          <span aria-hidden="true">G</span>
          {copy.google}
        </button>
        <div className="user-gate__divider"><span>{copy.divider}</span></div>
        <button type="button" onClick={handleEmailAuth}>{mode === 'signup' ? copy.signup : copy.login}</button>
        <button className="ghost" type="button" onClick={handleGuestLogin}>{copy.guest}</button>
      </div>
    </section>
  );
}

function SignupFields({ copy, form, update }: { copy: typeof userGateText.ru; form: UserGateForm; update: (field: keyof UserGateForm, value: string) => void }) {
  return (
    <>
      <Input label={copy.name} value={form.name} onChange={(value) => update('name', value)} />
      <Input label={copy.surname} value={form.surname} onChange={(value) => update('surname', value)} />
      <Input label={copy.nickname} value={form.nickname} onChange={(value) => update('nickname', value)} />
      <Input label={copy.phone} value={form.phone} onChange={(value) => update('phone', value)} type="tel" />
    </>
  );
}

function Input({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label>
      <span>{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} minLength={type === 'password' ? 6 : undefined} type={type} />
    </label>
  );
}

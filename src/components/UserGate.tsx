import { useState } from 'react';
import type { UserProfile } from '../lib/userProfile';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { useLanguage, type Language } from '../lib/language';
import './UserGate.css';

type Props = {
  onComplete: (profile: UserProfile) => void;
};

const text: Record<Language, {
  title: string;
  subtitle: string;
  name: string;
  nickname: string;
  password: string;
  button: string;
  login: string;
  google: string;
  error: string;
  googleError: string;
  googleDisabled: string;
}> = {
  kk: {
    title: 'Жеке инженерлік профиль',
    subtitle: 'Қолдануды бастау үшін аты-жөніңізді және никіңізді енгізіңіз.',
    name: 'Аты-жөні',
    nickname: 'Ник',
    password: 'Құпиясөз',
    button: 'Тіркелу',
    login: 'Кіру',
    google: 'Google арқылы кіру',
    error: 'Аты-жөніңізді, ник және кемінде 6 таңбалы құпиясөз енгізіңіз.',
    googleError: 'Supabase бапталмаған немесе Google Provider қосылмаған.',
    googleDisabled: 'Supabase ішінде Google Provider қосылмаған.',
  },
  ru: {
    title: 'Мини-регистрация',
    subtitle: 'Чтобы пользоваться агентом, введите имя и придумайте ник.',
    name: 'Имя',
    nickname: 'Ник',
    password: 'Пароль',
    button: 'Зарегистрироваться',
    login: 'Войти',
    google: 'Войти через Google',
    error: 'Заполните имя, ник и пароль минимум 6 символов.',
    googleError: 'Supabase не настроен или Google Provider ещё не включён.',
    googleDisabled: 'В Supabase ещё не включён Google Provider.',
  },
  en: {
    title: 'Mini registration',
    subtitle: 'Enter your name and choose a nickname to use the agent.',
    name: 'Name',
    nickname: 'Nickname',
    password: 'Password',
    button: 'Sign up',
    login: 'Log in',
    google: 'Continue with Google',
    error: 'Fill in name, nickname, and a password of at least 6 characters.',
    googleError: 'Supabase is not configured or Google Provider is not enabled yet.',
    googleDisabled: 'Google Provider is not enabled in Supabase yet.',
  },
};

export function UserGate({ onComplete }: Props) {
  const { language } = useLanguage();
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const copy = text[language];

  function handleSubmit() {
    const nextName = name.trim();
    const nextNickname = nickname.trim();

    if (!nextName || !nextNickname || password.length < 6) {
      setError(copy.error);
      return;
    }

    onComplete({ name: nextName, nickname: nextNickname, provider: 'local' });
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

    if (authError) {
      const isProviderDisabled = authError.message.toLowerCase().includes('unsupported provider');
      setError(isProviderDisabled ? copy.googleDisabled : authError.message);
    }
  }

  return (
    <section className="user-gate">
      <div className="card user-gate__card">
        <p className="eyebrow">Aerospace Access</p>
        <h1>{copy.title}</h1>
        <p>{copy.subtitle}</p>
        <label>
          <span>{copy.name}</span>
          <input value={name} onChange={(event) => setName(event.target.value)} type="text" />
        </label>
        <label>
          <span>{copy.nickname}</span>
          <input value={nickname} onChange={(event) => setNickname(event.target.value)} type="text" />
        </label>
        <label>
          <span>{copy.password}</span>
          <input value={password} onChange={(event) => setPassword(event.target.value)} minLength={6} type="password" />
        </label>
        {error && <p className="message">{error}</p>}
        <button className="user-gate__google" type="button" onClick={handleGoogleLogin}>
          <span aria-hidden="true">G</span>
          {copy.google}
        </button>
        <div className="user-gate__divider"><span>или</span></div>
        <div className="user-gate__actions">
          <button type="button" onClick={handleSubmit}>{copy.button}</button>
          <button className="ghost" type="button" onClick={handleSubmit}>{copy.login}</button>
        </div>
      </div>
    </section>
  );
}

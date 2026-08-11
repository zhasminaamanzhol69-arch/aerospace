import { useState } from 'react';
import type { UserProfile } from '../lib/userProfile';
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
  button: string;
  error: string;
}> = {
  kk: {
    title: 'Жеке инженерлік профиль',
    subtitle: 'Қолдануды бастау үшін аты-жөніңізді және никіңізді енгізіңіз.',
    name: 'Аты-жөні',
    nickname: 'Ник',
    button: 'Жүйеге кіру',
    error: 'Аты-жөніңізді және никіңізді толтырыңыз.',
  },
  ru: {
    title: 'Мини-регистрация',
    subtitle: 'Чтобы пользоваться агентом, введите имя и придумайте ник.',
    name: 'Имя',
    nickname: 'Ник',
    button: 'Начать пользоваться',
    error: 'Заполните имя и ник.',
  },
  en: {
    title: 'Mini registration',
    subtitle: 'Enter your name and choose a nickname to use the agent.',
    name: 'Name',
    nickname: 'Nickname',
    button: 'Start using',
    error: 'Fill in your name and nickname.',
  },
};

export function UserGate({ onComplete }: Props) {
  const { language } = useLanguage();
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const copy = text[language];

  function handleSubmit() {
    const nextName = name.trim();
    const nextNickname = nickname.trim();

    if (!nextName || !nextNickname) {
      setError(copy.error);
      return;
    }

    onComplete({ name: nextName, nickname: nextNickname });
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
        {error && <p className="message">{error}</p>}
        <button type="button" onClick={handleSubmit}>{copy.button}</button>
      </div>
    </section>
  );
}

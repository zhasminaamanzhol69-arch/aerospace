import { useState } from 'react';
import { Link } from 'wouter';
import type { UserProfile } from '../lib/userProfile';
import { useLanguage, type Language } from '../lib/language';
import './ProfileMenu.css';

type Props = {
  profile: UserProfile;
  onLogout: () => void;
};

const text: Record<Language, { profile: string; name: string; nickname: string; open: string; logout: string }> = {
  kk: { profile: 'Профиль', name: 'Аты-жөні', nickname: 'Ник', open: 'Менің профилім', logout: 'Шығу' },
  ru: { profile: 'Профиль', name: 'Имя', nickname: 'Ник', open: 'Мой профиль', logout: 'Выйти' },
  en: { profile: 'Profile', name: 'Name', nickname: 'Nickname', open: 'My profile', logout: 'Log out' },
};

export function ProfileMenu({ profile, onLogout }: Props) {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const copy = text[language];
  const initial = profile.name.trim().charAt(0).toUpperCase() || 'A';

  return (
    <div className="profile-menu">
      <button
        aria-expanded={isOpen}
        className="profile-menu__button"
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        <span aria-hidden="true">{initial}</span>
      </button>
      {isOpen && (
        <div className="profile-menu__panel">
          <h3>{copy.profile}</h3>
          <p>{copy.name}: {profile.name}</p>
          <p>{copy.nickname}: @{profile.nickname}</p>
          <Link className="profile-menu__link" href="/profile" onClick={() => setIsOpen(false)}>
            {copy.open}
          </Link>
          <button className="profile-menu__logout" onClick={onLogout} type="button">
            <span aria-hidden="true">↪</span>
            {copy.logout}
          </button>
        </div>
      )}
    </div>
  );
}

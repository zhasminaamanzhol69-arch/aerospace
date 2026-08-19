import { useEffect, useState } from 'react';
import { playIntroLaunchSound } from '../lib/introSound';
import { useLanguage, type Language } from '../lib/language';
import './IntroSplash.css';

type Props = {
  onDone: () => void;
};

const text: Record<Language, { subtitle: string; tag: string; hint: string }> = {
  kk: {
    subtitle: 'ұшу және ғарыш аппараттарына арналған инженерлік агент',
    tag: 'Design • Manufacturing • Operations',
    hint: 'бастау үшін экранды басыңыз',
  },
  ru: {
    subtitle: 'инженерный агент для летательных и космических аппаратов',
    tag: 'Проектирование • Производство • Эксплуатация',
    hint: 'нажмите на экран для старта',
  },
  en: {
    subtitle: 'engineering agent for aircraft and spacecraft',
    tag: 'Design • Manufacturing • Operations',
    hint: 'tap anywhere to start',
  },
};

export function IntroSplash({ onDone }: Props) {
  const { language } = useLanguage();
  const [isStarted, setIsStarted] = useState(false);
  const copy = text[language];

  useEffect(() => {
    if (!isStarted) return undefined;
    const timer = window.setTimeout(onDone, 6500);
    return () => window.clearTimeout(timer);
  }, [isStarted, onDone]);

  async function handleStart() {
    if (isStarted) return;
    setIsStarted(true);
    await playIntroLaunchSound();
  }

  return (
    <section
      className={`intro-splash ${isStarted ? 'is-started' : ''}`}
      aria-label="Vectori intro"
      onClick={handleStart}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') handleStart();
      }}
      role="button"
      tabIndex={0}
    >
      <div className="intro-splash__sky">
        <div className="intro-splash__planet" aria-hidden="true">
          <span className="intro-splash__moon intro-splash__moon--one" />
          <span className="intro-splash__moon intro-splash__moon--two" />
        </div>
        <div className="intro-splash__streak" />
        <div className="intro-splash__rocket">
          <span />
        </div>
      </div>
      <div className="intro-splash__content">
        <p>{copy.tag}</p>
        <h1>Vectori</h1>
        <span>{copy.subtitle}</span>
        {!isStarted && <small>{copy.hint}</small>}
      </div>
    </section>
  );
}

import { useEffect, useState } from 'react';
import { useLanguage, type Language } from '../lib/language';
import './IntroSplash.css';

type Props = {
  onDone: () => void;
};

type AudioWindow = Window & typeof globalThis & {
  webkitAudioContext?: typeof AudioContext;
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
    await playSoftRotor();
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

async function playSoftRotor() {
  const audioWindow = window as AudioWindow;
  const AudioContextClass = audioWindow.AudioContext || audioWindow.webkitAudioContext;
  if (!AudioContextClass) return;

  try {
    const audio = new AudioContextClass();
    if (audio.state === 'suspended') await audio.resume();
    const duration = 4.2;
    const buffer = audio.createBuffer(1, audio.sampleRate * duration, audio.sampleRate);
    const data = buffer.getChannelData(0);

    for (let index = 0; index < data.length; index += 1) {
      const progress = index / data.length;
      const envelope = Math.sin(progress * Math.PI);
      data[index] = (Math.random() * 2 - 1) * envelope;
    }

    const noise = audio.createBufferSource();
    const noiseFilter = audio.createBiquadFilter();
    const noiseGain = audio.createGain();
    const rotor = audio.createOscillator();
    const rotorPulse = audio.createOscillator();
    const rotorGain = audio.createGain();

    noise.buffer = buffer;
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(620, audio.currentTime);
    noiseFilter.frequency.linearRampToValueAtTime(840, audio.currentTime + 1.1);
    noiseFilter.frequency.linearRampToValueAtTime(360, audio.currentTime + duration);
    noiseGain.gain.setValueAtTime(0.0001, audio.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.18, audio.currentTime + 0.35);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + duration);

    rotor.type = 'sine';
    rotor.frequency.setValueAtTime(38, audio.currentTime);
    rotor.frequency.linearRampToValueAtTime(46, audio.currentTime + 1.4);
    rotor.frequency.linearRampToValueAtTime(34, audio.currentTime + duration);
    rotorPulse.type = 'triangle';
    rotorPulse.frequency.setValueAtTime(92, audio.currentTime);
    rotorPulse.frequency.linearRampToValueAtTime(104, audio.currentTime + 1.4);
    rotorPulse.frequency.linearRampToValueAtTime(78, audio.currentTime + duration);
    rotorGain.gain.setValueAtTime(0.0001, audio.currentTime);
    rotorGain.gain.exponentialRampToValueAtTime(0.16, audio.currentTime + 0.28);
    rotorGain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + duration);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(audio.destination);
    rotor.connect(rotorGain);
    rotorPulse.connect(rotorGain);
    rotorGain.connect(audio.destination);
    noise.start();
    rotor.start();
    rotorPulse.start();
    playVectoriMelody(audio, 3.75);
    noise.stop(audio.currentTime + duration);
    rotor.stop(audio.currentTime + duration);
    rotorPulse.stop(audio.currentTime + duration);
  } catch {
    // Autoplay audio can be blocked by the browser before user interaction.
  }
}

function playVectoriMelody(audio: AudioContext, delaySeconds: number) {
  const notes = [
    { frequency: 523.25, offset: 0, length: 0.24 },
    { frequency: 659.25, offset: 0.26, length: 0.24 },
    { frequency: 783.99, offset: 0.52, length: 0.3 },
    { frequency: 1046.5, offset: 0.88, length: 0.55 },
  ];

  notes.forEach((note) => {
    const start = audio.currentTime + delaySeconds + note.offset;
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(note.frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.12, start + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + note.length);
    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.start(start);
    oscillator.stop(start + note.length + 0.03);
  });
}

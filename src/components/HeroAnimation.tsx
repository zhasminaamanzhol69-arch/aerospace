import { useEffect, useRef, useState } from 'react';
import { startFlightSound, type FlightSound } from '../lib/flightSound';
import './HeroAnimation.css';

type HeroAnimationProps = {
  isSpacecraft: boolean;
  label: string;
};

export function HeroAnimation({ isSpacecraft, label }: HeroAnimationProps) {
  const [soundOn, setSoundOn] = useState(false);
  const soundRef = useRef<FlightSound | null>(null);
  const soundMode = isSpacecraft ? 'space' : 'flight';

  useEffect(() => {
    return () => {
      soundRef.current?.stop();
      soundRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!soundOn) return;
    let isCurrent = true;

    soundRef.current?.stop();
    soundRef.current = null;

    startFlightSound(soundMode)
      .then((sound) => {
        if (isCurrent) {
          soundRef.current = sound;
          return;
        }
        sound.stop();
      })
      .catch(() => setSoundOn(false));

    return () => {
      isCurrent = false;
    };
  }, [soundMode]);

  async function toggleSound() {
    if (soundOn) {
      soundRef.current?.stop();
      soundRef.current = null;
      setSoundOn(false);
      return;
    }

    try {
      soundRef.current = await startFlightSound(soundMode);
      setSoundOn(true);
    } catch {
      setSoundOn(false);
    }
  }

  return (
    <div
      aria-label={label}
      className={isSpacecraft ? 'hero-animation hero-animation--space' : 'hero-animation hero-animation--flight'}
      role="img"
    >
      <span className="hero-animation__grid" />
      <span className="hero-animation__route" />
      <span className="hero-animation__route hero-animation__route--second" />
      {isSpacecraft ? <SpaceScene /> : <FlightScene />}
      <button
        aria-label={soundOn ? 'Выключить звук полета' : 'Включить звук полета'}
        className={soundOn ? 'hero-animation__sound is-active' : 'hero-animation__sound'}
        onClick={toggleSound}
        title={soundOn ? 'Выключить звук' : 'Включить звук'}
        type="button"
      >
        {soundOn ? '♪' : '♫'}
      </button>
    </div>
  );
}

function FlightScene() {
  return (
    <>
      <span className="hero-animation__sun" />
      <span className="hero-animation__cloud hero-animation__cloud--one" />
      <span className="hero-animation__cloud hero-animation__cloud--two" />
      <span className="hero-animation__aircraft">
        <span className="hero-animation__aircraft-body" />
        <span className="hero-animation__wing hero-animation__wing--top" />
        <span className="hero-animation__wing hero-animation__wing--bottom" />
        <span className="hero-animation__tail" />
      </span>
    </>
  );
}

function SpaceScene() {
  return (
    <>
      <span className="hero-animation__planet" />
      <span className="hero-animation__orbit hero-animation__orbit--one" />
      <span className="hero-animation__orbit hero-animation__orbit--two" />
      <span className="hero-animation__satellite">
        <span className="hero-animation__satellite-core" />
        <span className="hero-animation__panel hero-animation__panel--left" />
        <span className="hero-animation__panel hero-animation__panel--right" />
      </span>
      <span className="hero-animation__star hero-animation__star--one" />
      <span className="hero-animation__star hero-animation__star--two" />
    </>
  );
}

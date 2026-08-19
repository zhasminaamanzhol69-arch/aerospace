import { useEffect, useRef, useState } from 'react';
import { startOrbitalMelody, type OrbitalMelody } from '../lib/orbitalMelody';
import './TutorialMelodyButton.css';

export function TutorialMelodyButton() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [message, setMessage] = useState('');
  const melodyRef = useRef<OrbitalMelody | null>(null);

  useEffect(() => {
    return () => {
      melodyRef.current?.stop();
      melodyRef.current = null;
    };
  }, []);

  async function toggleMelody() {
    if (isPlaying) {
      melodyRef.current?.stop();
      melodyRef.current = null;
      setIsPlaying(false);
      setMessage('');
      return;
    }

    try {
      melodyRef.current = await startOrbitalMelody();
      setIsPlaying(true);
      setMessage('');
    } catch {
      setIsPlaying(false);
      setMessage('Safari не дал доступ к звуку. Нажмите ещё раз или проверьте звук вкладки.');
    }
  }

  return (
    <div className="tutorial-melody-box">
      <button
        aria-label={isPlaying ? 'Выключить мелодию планеты' : 'Включить мелодию планеты'}
        className={isPlaying ? 'tutorial-melody is-playing' : 'tutorial-melody'}
        onClick={toggleMelody}
        type="button"
      >
        <span aria-hidden="true">{isPlaying ? '♪' : '♫'}</span>
        {isPlaying ? 'Музыка включена' : 'Включить музыку'}
      </button>
      {message && <small>{message}</small>}
    </div>
  );
}

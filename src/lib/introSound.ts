import { playAudioProbe } from './audioProbe';

type AudioWindow = Window & typeof globalThis & {
  webkitAudioContext?: typeof AudioContext;
};

export async function playIntroLaunchSound() {
  const audioWindow = window as AudioWindow;
  const AudioContextClass = audioWindow.AudioContext || audioWindow.webkitAudioContext;
  if (!AudioContextClass) return;

  try {
    const probePromise = playAudioProbe();
    const audio = new AudioContextClass();
    if (audio.state === 'suspended') await audio.resume();

    const duration = 6.2;
    const noise = audio.createBufferSource();
    const noiseFilter = audio.createBiquadFilter();
    const noiseGain = audio.createGain();
    const engine = audio.createOscillator();
    const pulse = audio.createOscillator();
    const engineGain = audio.createGain();
    const startTone = audio.createOscillator();
    const startToneGain = audio.createGain();

    noise.buffer = createNoiseBuffer(audio, duration);
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(520, audio.currentTime);
    noiseFilter.frequency.linearRampToValueAtTime(1150, audio.currentTime + 1.8);
    noiseFilter.frequency.linearRampToValueAtTime(430, audio.currentTime + duration);
    noiseGain.gain.setValueAtTime(0.0001, audio.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.62, audio.currentTime + 0.35);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + duration);

    engine.type = 'sawtooth';
    engine.frequency.setValueAtTime(54, audio.currentTime);
    engine.frequency.linearRampToValueAtTime(72, audio.currentTime + 1.8);
    engine.frequency.linearRampToValueAtTime(38, audio.currentTime + duration);
    pulse.type = 'triangle';
    pulse.frequency.setValueAtTime(118, audio.currentTime);
    pulse.frequency.linearRampToValueAtTime(136, audio.currentTime + 1.8);
    pulse.frequency.linearRampToValueAtTime(88, audio.currentTime + duration);
    engineGain.gain.setValueAtTime(0.0001, audio.currentTime);
    engineGain.gain.exponentialRampToValueAtTime(0.48, audio.currentTime + 0.24);
    engineGain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + duration);
    startTone.type = 'sine';
    startTone.frequency.setValueAtTime(440, audio.currentTime);
    startTone.frequency.linearRampToValueAtTime(660, audio.currentTime + 0.24);
    startToneGain.gain.setValueAtTime(0.0001, audio.currentTime);
    startToneGain.gain.exponentialRampToValueAtTime(0.3, audio.currentTime + 0.04);
    startToneGain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.55);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(audio.destination);
    engine.connect(engineGain);
    pulse.connect(engineGain);
    engineGain.connect(audio.destination);
    startTone.connect(startToneGain);
    startToneGain.connect(audio.destination);
    noise.start();
    engine.start();
    pulse.start();
    startTone.start();
    playVectoriMelody(audio, 3.75);
    startTone.stop(audio.currentTime + 0.58);
    stopSound(audio, [noise, engine, pulse], duration);
    void probePromise.catch(() => undefined);
  } catch {
    // The browser can block sound until the intro screen is clicked.
  }
}

function createNoiseBuffer(audio: AudioContext, duration: number) {
  const buffer = audio.createBuffer(1, audio.sampleRate * duration, audio.sampleRate);
  const data = buffer.getChannelData(0);

  for (let index = 0; index < data.length; index += 1) {
    const progress = index / data.length;
    const envelope = Math.sin(progress * Math.PI);
    data[index] = (Math.random() * 2 - 1) * envelope;
  }

  return buffer;
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
    gain.gain.exponentialRampToValueAtTime(0.38, start + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + note.length);
    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.start(start);
    oscillator.stop(start + note.length + 0.03);
  });
}

function stopSound(audio: AudioContext, sources: AudioScheduledSourceNode[], duration: number) {
  sources.forEach((source) => source.stop(audio.currentTime + duration));
  window.setTimeout(() => void audio.close(), (duration + 0.4) * 1000);
}

export type OrbitalMelody = {
  stop: () => void;
};

type AudioWindow = Window & {
  webkitAudioContext?: typeof AudioContext;
};

export async function startOrbitalMelody(): Promise<OrbitalMelody> {
  const AudioContextCtor = window.AudioContext || (window as AudioWindow).webkitAudioContext;
  if (!AudioContextCtor) throw new Error('AudioContext is not supported');

  const audio = new AudioContextCtor();
  const master = audio.createGain();
  const pad = audio.createOscillator();
  const padGain = audio.createGain();
  const lfo = audio.createOscillator();
  const lfoGain = audio.createGain();

  await audio.resume();
  master.gain.value = 0.0001;
  pad.type = 'sine';
  pad.frequency.value = 130.81;
  padGain.gain.value = 0.11;
  lfo.frequency.value = 0.18;
  lfoGain.gain.value = 16;
  pad.connect(padGain);
  padGain.connect(master);
  lfo.connect(lfoGain);
  lfoGain.connect(pad.frequency);
  master.connect(audio.destination);
  pad.start();
  lfo.start();
  master.gain.linearRampToValueAtTime(0.28, audio.currentTime + 0.35);
  const timers = scheduleMelody(audio, master);

  return {
    stop: () => {
      timers.forEach((timer) => window.clearInterval(timer));
      master.gain.cancelScheduledValues(audio.currentTime);
      master.gain.linearRampToValueAtTime(0.0001, audio.currentTime + 0.22);
      window.setTimeout(() => {
        pad.stop();
        lfo.stop();
        void audio.close();
      }, 260);
    },
  };
}

function scheduleMelody(audio: AudioContext, destination: AudioNode) {
  const notes = [523.25, 659.25, 783.99, 987.77, 880, 659.25];
  const timer = window.setInterval(() => playPhrase(audio, destination, notes), 3600);
  playPhrase(audio, destination, notes);
  return [timer];
}

function playPhrase(audio: AudioContext, destination: AudioNode, notes: number[]) {
  notes.forEach((frequency, index) => {
    const start = audio.currentTime + index * 0.42;
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.16, start + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.34);
    oscillator.connect(gain);
    gain.connect(destination);
    oscillator.start(start);
    oscillator.stop(start + 0.38);
  });
}

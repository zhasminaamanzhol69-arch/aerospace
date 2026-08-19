import { playAudioProbe } from './audioProbe';

export type FlightSoundMode = 'flight' | 'space';

export type FlightSound = {
  stop: () => void;
};

type AudioWindow = Window & {
  webkitAudioContext?: typeof AudioContext;
};

export async function startFlightSound(mode: FlightSoundMode): Promise<FlightSound> {
  const AudioContextCtor = window.AudioContext || (window as AudioWindow).webkitAudioContext;
  if (!AudioContextCtor) {
    throw new Error('AudioContext is not supported');
  }

  const probePromise = playAudioProbe();
  const context = new AudioContextCtor();
  const masterGain = context.createGain();
  const noiseFilter = context.createBiquadFilter();
  const noiseSource = context.createBufferSource();
  const engine = context.createOscillator();
  const engineGain = context.createGain();
  const startTone = context.createOscillator();
  const startToneGain = context.createGain();
  const lfo = context.createOscillator();
  const lfoGain = context.createGain();
  const settings = getSoundSettings(mode);

  masterGain.gain.value = 0.0001;
  noiseFilter.type = mode === 'space' ? 'lowpass' : 'bandpass';
  noiseFilter.frequency.value = settings.filterFrequency;
  noiseFilter.Q.value = settings.filterQ;
  engine.type = mode === 'space' ? 'sine' : 'sawtooth';
  engine.frequency.value = settings.engineFrequency;
  engineGain.gain.value = settings.engineVolume;
  startTone.type = 'sine';
  startTone.frequency.value = mode === 'space' ? 220 : 330;
  startToneGain.gain.value = 0.0001;
  lfo.frequency.value = settings.lfoFrequency;
  lfoGain.gain.value = settings.lfoDepth;

  noiseSource.buffer = createNoiseBuffer(context);
  noiseSource.loop = true;
  noiseSource.connect(noiseFilter);
  noiseFilter.connect(masterGain);
  engine.connect(engineGain);
  engineGain.connect(masterGain);
  startTone.connect(startToneGain);
  startToneGain.connect(masterGain);
  lfo.connect(lfoGain);
  lfoGain.connect(noiseFilter.frequency);
  masterGain.connect(context.destination);

  noiseSource.start();
  engine.start();
  startTone.start();
  lfo.start();
  masterGain.gain.linearRampToValueAtTime(settings.volume, context.currentTime + 0.35);
  startToneGain.gain.linearRampToValueAtTime(0.22, context.currentTime + 0.04);
  startToneGain.gain.linearRampToValueAtTime(0.0001, context.currentTime + 0.46);
  await context.resume();
  void probePromise.catch(() => undefined);

  return {
    stop: () => {
      const endTime = context.currentTime + 0.18;
      masterGain.gain.cancelScheduledValues(context.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.0001, endTime);
      window.setTimeout(() => {
        noiseSource.stop();
        engine.stop();
        startTone.stop();
        lfo.stop();
        void context.close();
      }, 220);
    },
  };
}

function createNoiseBuffer(context: AudioContext) {
  const bufferLength = context.sampleRate * 2;
  const buffer = context.createBuffer(1, bufferLength, context.sampleRate);
  const data = buffer.getChannelData(0);

  for (let index = 0; index < bufferLength; index += 1) {
    data[index] = Math.random() * 2 - 1;
  }

  return buffer;
}

function getSoundSettings(mode: FlightSoundMode) {
  if (mode === 'space') {
    return {
      engineFrequency: 92,
      engineVolume: 0.12,
      filterFrequency: 620,
      filterQ: 0.7,
      lfoDepth: 90,
      lfoFrequency: 0.32,
      volume: 0.24,
    };
  }

  return {
    engineFrequency: 128,
    engineVolume: 0.11,
    filterFrequency: 980,
    filterQ: 0.9,
    lfoDepth: 160,
    lfoFrequency: 0.55,
    volume: 0.26,
  };
}

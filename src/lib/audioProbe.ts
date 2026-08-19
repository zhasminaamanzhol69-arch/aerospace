export async function playAudioProbe() {
  const audio = new Audio(createBeepDataUrl());
  audio.volume = 1;
  await audio.play();
}

function createBeepDataUrl() {
  const sampleRate = 44_100;
  const durationSeconds = 0.42;
  const frequency = 880;
  const sampleCount = Math.floor(sampleRate * durationSeconds);
  const dataSize = sampleCount * 2;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  for (let index = 0; index < sampleCount; index += 1) {
    const fade = Math.min(index / 800, (sampleCount - index) / 1200, 1);
    const sample = Math.sin((2 * Math.PI * frequency * index) / sampleRate) * 0.72 * fade;
    view.setInt16(44 + index * 2, sample * 32767, true);
  }

  return `data:audio/wav;base64,${arrayBufferToBase64(buffer)}`;
}

function writeString(view: DataView, offset: number, value: string) {
  for (let index = 0; index < value.length; index += 1) {
    view.setUint8(offset + index, value.charCodeAt(index));
  }
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';

  for (let index = 0; index < bytes.length; index += 1) {
    binary += String.fromCharCode(bytes[index]);
  }

  return window.btoa(binary);
}

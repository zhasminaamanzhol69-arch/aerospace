import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Language } from './language';

type SpeechAlternative = {
  transcript: string;
};

type SpeechResult = ArrayLike<SpeechAlternative> & {
  isFinal: boolean;
};

type SpeechEvent = {
  resultIndex: number;
  results: ArrayLike<SpeechResult>;
};

type SpeechError = {
  error: string;
};

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onend: (() => void) | null;
  onerror: ((event: SpeechError) => void) | null;
  onresult: ((event: SpeechEvent) => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

type SpeechWindow = Window & typeof globalThis & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

type Options = {
  language: Language;
  onFinalText: (text: string) => void;
  onError: (message: string) => void;
  unsupportedMessage: string;
};

export function useVoiceDictation({ language, onFinalText, onError, unsupportedMessage }: Options) {
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const SpeechRecognition = useMemo(() => getSpeechRecognition(), []);
  const isSupported = Boolean(SpeechRecognition);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
    setInterimText('');
  }, []);

  const start = useCallback(() => {
    if (!SpeechRecognition) {
      onError(unsupportedMessage);
      return;
    }

    stop();
    const recognition = new SpeechRecognition();
    recognition.lang = speechLanguage(language);
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      const { finalText, draftText } = collectSpeechText(event);
      if (finalText) onFinalText(finalText);
      setInterimText(draftText);
    };
    recognition.onerror = (event) => {
      if (event.error !== 'no-speech') onError(unsupportedMessage);
      stop();
    };
    recognition.onend = () => {
      recognitionRef.current = null;
      setIsListening(false);
      setInterimText('');
    };

    recognitionRef.current = recognition;
    setIsListening(true);
    recognition.start();
  }, [SpeechRecognition, language, onError, onFinalText, stop, unsupportedMessage]);

  const toggle = useCallback(() => {
    if (isListening) {
      stop();
      return;
    }
    start();
  }, [isListening, start, stop]);

  useEffect(() => stop, [stop]);

  return { interimText, isListening, isSupported, toggle };
}

function collectSpeechText(event: SpeechEvent) {
  let finalText = '';
  let draftText = '';

  for (let index = event.resultIndex; index < event.results.length; index += 1) {
    const result = event.results[index];
    const transcript = result[0]?.transcript.trim();
    if (!transcript) continue;
    if (result.isFinal) finalText = joinText(finalText, transcript);
    else draftText = joinText(draftText, transcript);
  }

  return { finalText, draftText };
}

function getSpeechRecognition() {
  const speechWindow = window as SpeechWindow;
  return speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
}

function joinText(current: string, next: string) {
  return `${current}${current ? ' ' : ''}${next}`;
}

function speechLanguage(language: Language) {
  if (language === 'kk') return 'kk-KZ';
  if (language === 'ru') return 'ru-RU';
  return 'en-US';
}

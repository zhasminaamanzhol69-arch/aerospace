import { createContext, useContext } from 'react';

export type Language = 'kk' | 'ru' | 'en';

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
};

export const languageLabels: Record<Language, string> = {
  kk: 'ҚАЗ',
  ru: 'RU',
  en: 'EN',
};

export const LanguageContext = createContext<LanguageContextValue | null>(null);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside LanguageContext');
  return context;
}

import { languageLabels, type Language, useLanguage } from '../lib/language';
import './LanguageSelector.css';

const languages: Language[] = ['kk', 'ru', 'en'];
const title: Record<Language, string> = { kk: 'Тіл', ru: 'Язык', en: 'Language' };

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="language-selector" aria-label="Language selector">
      <span>{title[language]}</span>
      <div>
        {languages.map((item) => (
          <button
            className={item === language ? 'is-selected' : ''}
            key={item}
            onClick={() => setLanguage(item)}
            type="button"
          >
            {languageLabels[item]}
          </button>
        ))}
      </div>
    </div>
  );
}

import { Link } from 'wouter';
import { DocumentAnalyzer } from '../components/DocumentAnalyzer';
import { LanguageSelector } from '../components/LanguageSelector';
import { SiteMenu } from '../components/SiteMenu';
import { useLanguage, type Language } from '../lib/language';
import { loadUserProfile } from '../lib/userProfile';

const backText: Record<Language, string> = { kk: 'Артқа', ru: 'Назад', en: 'Back' };

export function DocumentsPage() {
  const { language } = useLanguage();
  const profile = loadUserProfile();

  return (
    <main className="container mission-page">
      <div className="top-bar">
        <Link href="/">
          <button className="ghost" type="button">{backText[language]}</button>
        </Link>
        {profile && <SiteMenu />}
        <LanguageSelector />
      </div>
      <DocumentAnalyzer />
    </main>
  );
}

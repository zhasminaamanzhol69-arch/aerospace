import { Link } from 'wouter';
import { DocumentAnalyzer } from '../components/DocumentAnalyzer';
import { SiteMenu } from '../components/SiteMenu';
import { loadUserProfile } from '../lib/userProfile';

export function DocumentsPage() {
  const profile = loadUserProfile();

  return (
    <main className="container mission-page">
      <div className="top-bar">
        <Link href="/">
          <button className="ghost" type="button">Назад</button>
        </Link>
        {profile && <SiteMenu />}
      </div>
      <DocumentAnalyzer />
    </main>
  );
}

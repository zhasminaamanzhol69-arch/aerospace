import { Link } from 'wouter';
import { LanguageSelector } from '../components/LanguageSelector';
import { SiteMenu } from '../components/SiteMenu';
import { dronesPageText } from '../lib/dronesPageText';
import { useLanguage } from '../lib/language';
import { loadUserProfile } from '../lib/userProfile';
import './DronesPage.css';

export function DronesPage() {
  const { language } = useLanguage();
  const copy = dronesPageText[language];
  const profile = loadUserProfile();

  return (
    <main className="container drone-page">
      <div className="top-bar">
        <Link href="/">
          <button className="ghost" type="button">{copy.back}</button>
        </Link>
        {profile && <SiteMenu />}
        <LanguageSelector />
      </div>

      <section className="drone-hero">
        <p className="eyebrow">Rescue UAV Systems</p>
        <h1>{copy.heroTitle}</h1>
        <p>{copy.heroBody}</p>
      </section>

      <section className="drone-grid">
        {copy.drones.map((drone) => (
          <article className="drone-card" key={drone.name}>
            <img src={drone.image} alt={drone.name} />
            <h2>{drone.name}</h2>
            <p><span>{copy.mission}:</span> {drone.mission}</p>
            <p><span>{copy.payload}:</span> {drone.payload}</p>
            <p><span>{copy.strength}:</span> {drone.strength}</p>
            <p><span>{copy.limits}:</span> {drone.limits}</p>
          </article>
        ))}
      </section>

      <section className="card rescue-checklist">
        <p className="eyebrow">Rescue Mission Checklist</p>
        <h2>{copy.checklistTitle}</h2>
        <ol>
          {copy.checks.map((check) => <li key={check}>{check}</li>)}
        </ol>
      </section>
    </main>
  );
}

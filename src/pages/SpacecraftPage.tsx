import { Link } from 'wouter';
import { LanguageSelector } from '../components/LanguageSelector';
import { SiteMenu } from '../components/SiteMenu';
import { useLanguage } from '../lib/language';
import { spacecraftPageText } from '../lib/spacecraftPageText';
import { loadUserProfile } from '../lib/userProfile';
import './SpacecraftPage.css';

export function SpacecraftPage() {
  const { language } = useLanguage();
  const copy = spacecraftPageText[language];
  const profile = loadUserProfile();

  return (
    <main className="container spacecraft-page">
      <div className="top-bar">
        <Link href="/">
          <button className="ghost" type="button">{copy.back}</button>
        </Link>
        {profile && <SiteMenu />}
        <LanguageSelector />
      </div>

      <section className="spacecraft-hero">
        <p className="eyebrow">CubeSat / Satellite Systems</p>
        <h1>{copy.heroTitle}</h1>
        <p>{copy.heroBody}</p>
      </section>

      <section className="spacecraft-grid">
        {copy.spacecraft.map((item) => (
          <article className="spacecraft-card" key={item.name}>
            <img src={item.image} alt={item.name} />
            <h2>{item.name}</h2>
            <p><span>{copy.mission}:</span> {item.mission}</p>
            <p><span>{copy.payload}:</span> {item.payload}</p>
            <p><span>{copy.strength}:</span> {item.strength}</p>
            <p><span>{copy.limits}:</span> {item.limits}</p>
          </article>
        ))}
      </section>

      <section className="card spacecraft-checklist">
        <p className="eyebrow">Space Mission Checklist</p>
        <h2>{copy.checklistTitle}</h2>
        <ol>
          {copy.checks.map((check) => <li key={check}>{check}</li>)}
        </ol>
      </section>
    </main>
  );
}

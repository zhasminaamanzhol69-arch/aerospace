import { Link } from 'wouter';
import { LanguageSelector } from '../components/LanguageSelector';
import { SiteMenu } from '../components/SiteMenu';
import { articlesPageText } from '../lib/articlesPageText';
import { useLanguage } from '../lib/language';
import { loadUserProfile } from '../lib/userProfile';
import './ArticlesPage.css';

export function ArticlesPage() {
  const { language } = useLanguage();
  const copy = articlesPageText[language];
  const profile = loadUserProfile();

  return (
    <main className="container articles-page">
      <div className="top-bar">
        <Link href="/">
          <button className="ghost" type="button">{copy.back}</button>
        </Link>
        {profile && <SiteMenu />}
        <LanguageSelector />
      </div>

      <section className="articles-hero">
        <p className="eyebrow">{copy.heroEyebrow}</p>
        <h1>{copy.heroTitle}</h1>
        <p>{copy.heroBody}</p>
      </section>

      <section className="facts-panel">
        <h2>{copy.factsTitle}</h2>
        <div>
          {copy.facts.map((fact) => (
            <article key={fact.value}>
              <strong>{fact.value}</strong>
              <span>{fact.label}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="articles-list">
        <h2>{copy.articlesTitle}</h2>
        <div>
          {copy.articles.map((article) => (
            <article className="article-card" key={article.title}>
              <img src={article.image} alt={article.title} />
              <span>{article.tag}</span>
              <h3>{article.title}</h3>
              <p>{article.body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

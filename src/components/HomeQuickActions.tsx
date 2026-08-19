import { Link } from 'wouter';
import { useLanguage } from '../lib/language';
import './HomeQuickActions.css';

const quickText = {
  kk: {
    eyebrow: 'Жылдам әрекеттер',
    title: 'Негізгі жұмыс 1-2 басуда ашылады',
    ask: 'AI-ға сұрақ қою',
    docs: 'PDF/DOCX талдау',
    drones: 'Авиация / БПЛА',
    space: 'Космонавтика / Спутниктер',
    articles: 'Фактілер мен мақалалар',
  },
  ru: {
    eyebrow: 'Быстрые действия',
    title: 'Главная работа открывается за 1-2 клика',
    ask: 'Спросить AI',
    docs: 'Анализ PDF/DOCX',
    drones: 'Авиация / БПЛА',
    space: 'Космонавтика / Спутники',
    articles: 'Факты и статьи',
  },
  en: {
    eyebrow: 'Quick actions',
    title: 'Start the main task in 1-2 clicks',
    ask: 'Ask AI',
    docs: 'Analyze PDF/DOCX',
    drones: 'Aviation / UAV',
    space: 'Spacecraft / Satellites',
    articles: 'Facts and Articles',
  },
};

export function HomeQuickActions() {
  const { language } = useLanguage();
  const text = quickText[language];

  return (
    <section className="quick-actions" aria-label={text.eyebrow}>
      <div>
        <span>{text.eyebrow}</span>
        <h2>{text.title}</h2>
      </div>
      <div className="quick-actions__links">
        <Link href="/drones">{text.drones}</Link>
        <Link href="/spacecraft">{text.space}</Link>
        <Link href="/documents">{text.docs}</Link>
        <Link href="/articles">{text.articles}</Link>
        <a href="#ai-agent">{text.ask}</a>
      </div>
    </section>
  );
}

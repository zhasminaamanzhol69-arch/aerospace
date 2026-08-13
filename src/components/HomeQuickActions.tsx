import { Link } from 'wouter';
import { useLanguage } from '../lib/language';
import './HomeQuickActions.css';

const quickText = {
  kk: {
    eyebrow: 'Жылдам әрекеттер',
    title: 'Негізгі жұмыс 1-2 басуда ашылады',
    ask: 'AI-ға сұрақ қою',
    docs: 'PDF/DOCX талдау',
    drones: 'Дрон түрлері',
    space: 'CubeSat / Satellite',
  },
  ru: {
    eyebrow: 'Быстрые действия',
    title: 'Главная работа открывается за 1-2 клика',
    ask: 'Спросить AI',
    docs: 'Анализ PDF/DOCX',
    drones: 'Виды дронов',
    space: 'CubeSat / Satellite',
  },
  en: {
    eyebrow: 'Quick actions',
    title: 'Start the main task in 1-2 clicks',
    ask: 'Ask AI',
    docs: 'Analyze PDF/DOCX',
    drones: 'Drone types',
    space: 'CubeSat / Satellite',
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
        <a href="#ai-agent">{text.ask}</a>
        <Link href="/documents">{text.docs}</Link>
        <Link href="/drones">{text.drones}</Link>
        <Link href="/spacecraft">{text.space}</Link>
      </div>
    </section>
  );
}

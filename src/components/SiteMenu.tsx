import { useState } from 'react';
import { Link } from 'wouter';
import { useLanguage, type Language } from '../lib/language';
import './SiteMenu.css';

const menuText: Record<Language, {
  title: string;
  sections: Array<{ href: string; title: string; description: string }>;
}> = {
  kk: {
    title: 'Бөлімдер',
    sections: [
      { href: '/', title: 'Басты бет', description: 'Aerospace Engineering Agent' },
      { href: '/drones', title: 'Дрон түрлері', description: 'Құтқару UAV және қолдану сценарийлері' },
      { href: '/spacecraft', title: 'Ғарыш аппараттары', description: 'CubeSat, Satellite және Payload' },
      { href: '/documents', title: 'Құжат талдауы', description: 'PDF/DOCX, ТУ, ГОСТ, ОСТ' },
    ],
  },
  ru: {
    title: 'Разделы',
    sections: [
      { href: '/', title: 'Главная', description: 'Aerospace Engineering Agent' },
      { href: '/drones', title: 'Виды дронов', description: 'Спасательные UAV и сценарии применения' },
      { href: '/spacecraft', title: 'Космические аппараты', description: 'CubeSat, Satellite и Payload' },
      { href: '/documents', title: 'Анализ документов', description: 'PDF/DOCX, ТУ, ГОСТ, ОСТ' },
    ],
  },
  en: {
    title: 'Sections',
    sections: [
      { href: '/', title: 'Home', description: 'Aerospace Engineering Agent' },
      { href: '/drones', title: 'Drone Types', description: 'Rescue UAV scenarios' },
      { href: '/spacecraft', title: 'Spacecraft', description: 'CubeSat, Satellite, and Payload' },
      { href: '/documents', title: 'Document Analysis', description: 'PDF/DOCX, specs, standards' },
    ],
  },
};

export function SiteMenu() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const copy = menuText[language];

  return (
    <nav className="site-menu">
      <button
        aria-expanded={isOpen}
        aria-label="Открыть разделы сайта"
        className="site-menu__button"
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        <span aria-hidden="true" />
      </button>
      {isOpen && (
        <div className="site-menu__panel">
          <strong>{copy.title}</strong>
          {copy.sections.map((section) => (
            <Link href={section.href} key={section.href} onClick={() => setIsOpen(false)}>
              <span>{section.title}</span>
              <small>{section.description}</small>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

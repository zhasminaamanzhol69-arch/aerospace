import { useState } from 'react';
import { Link } from 'wouter';
import './SiteMenu.css';

const sections = [
  { href: '/', title: 'Главная', description: 'Aerospace Engineering Agent' },
  { href: '/drones', title: 'Виды дронов', description: 'Спасательные UAV и сценарии применения' },
  { href: '/documents', title: 'Анализ документов', description: 'PDF/DOCX, ТУ, ГОСТ, ОСТ' },
];

export function SiteMenu() {
  const [isOpen, setIsOpen] = useState(false);

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
          <strong>Разделы</strong>
          {sections.map((section) => (
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

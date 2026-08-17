import type { VehicleDomain } from '../lib/vehicleDomain';
import { useLanguage, type Language } from '../lib/language';
import './VehicleDomainTabs.css';

type Props = {
  value: VehicleDomain;
  onChange: (domain: VehicleDomain) => void;
};

const text: Record<Language, {
  title: string;
  aviation: string;
  aviationHint: string;
  spacecraft: string;
  spacecraftHint: string;
}> = {
  kk: {
    title: 'Аппарат класы',
    aviation: 'Авиация / БПЛА',
    aviationHint: 'Атмосфералық ұшу',
    spacecraft: 'Космонавтика / Спутниктер',
    spacecraftHint: 'Ғарыш аппараты және пайдалы жүк',
  },
  ru: {
    title: 'Тип аппарата',
    aviation: 'Авиация / БПЛА',
    aviationHint: 'Полёт в атмосфере',
    spacecraft: 'Космонавтика / Спутники',
    spacecraftHint: 'Космический аппарат и полезная нагрузка',
  },
  en: {
    title: 'Vehicle domain',
    aviation: 'Aviation / UAV',
    aviationHint: 'Atmospheric Flight',
    spacecraft: 'Spacecraft / Satellites',
    spacecraftHint: 'Spacecraft & Payload',
  },
};

export function VehicleDomainTabs({ value, onChange }: Props) {
  const { language } = useLanguage();
  const copy = text[language];

  return (
    <section className="domain-tabs" aria-label={copy.title}>
      <p className="eyebrow">{copy.title}</p>
      <div className="domain-tabs__grid">
        <button
          className={value === 'aviation' ? 'is-active' : ''}
          onClick={() => onChange('aviation')}
          type="button"
        >
          <span>{copy.aviation}</span>
          <small>{copy.aviationHint}</small>
        </button>
        <button
          className={value === 'spacecraft' ? 'is-active' : ''}
          onClick={() => onChange('spacecraft')}
          type="button"
        >
          <span>{copy.spacecraft}</span>
          <small>{copy.spacecraftHint}</small>
        </button>
      </div>
    </section>
  );
}

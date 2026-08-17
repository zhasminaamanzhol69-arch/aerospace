import type { EngineeringStage } from '../lib/engineeringStage';
import { useLanguage, type Language } from '../lib/language';
import './StageTabs.css';

type Props = {
  value: EngineeringStage;
  onChange: (stage: EngineeringStage) => void;
};

const tabs: Array<{
  value: EngineeringStage;
  label: Record<Language, string>;
  detail: Record<Language, string>;
}> = [
  {
    value: 'design',
    label: {
      kk: '1. Жобалау',
      ru: '1. Проектирование',
      en: '1. Design & Engineering',
    },
    detail: {
      kk: 'Аэродинамика, беріктік, қуат',
      ru: 'Аэродинамика, прочность, мощность',
      en: 'Aerodynamics, loads, power',
    },
  },
  {
    value: 'manufacturing',
    label: {
      kk: '2. Дайындау',
      ru: '2. Производство',
      en: '2. Manufacturing',
    },
    detail: {
      kk: 'Материал, қосылыс, жинақтау',
      ru: 'Материалы, соединения, сборка',
      en: 'Materials, joining, assembly',
    },
  },
  {
    value: 'operations',
    label: {
      kk: '3. Пайдалану',
      ru: '3. Эксплуатация',
      en: '3. Operations',
    },
    detail: {
      kk: 'Сынақ, телеметрия, қауіпсіздік',
      ru: 'Испытания, телеметрия, безопасность',
      en: 'Testing, telemetry, safety',
    },
  },
];

export function StageTabs({ value, onChange }: Props) {
  const { language } = useLanguage();

  return (
    <section className="stage-tabs" aria-label="Lifecycle stage tabs">
      {tabs.map((tab) => (
        <button
          className={tab.value === value ? 'stage-tabs__item is-active' : 'stage-tabs__item'}
          key={tab.value}
          onClick={() => onChange(tab.value)}
          type="button"
        >
          <span>{tab.label[language]}</span>
          <small>{tab.detail[language]}</small>
        </button>
      ))}
    </section>
  );
}

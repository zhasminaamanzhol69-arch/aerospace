import { useState } from 'react';
import type { MissionRequirements } from '../lib/aerospace';
import { useLanguage, type Language } from '../lib/language';
import './MissionAiHelp.css';

type Props = {
  requirements: MissionRequirements;
};

const text: Record<Language, {
  button: string;
  title: string;
  close: string;
  intro: string;
  payload: string;
  endurance: string;
  choices: Record<string, string>;
}> = {
  kk: {
    button: 'AI көмегі',
    title: 'AI бастапқы талаптарды түсіндіреді',
    close: 'Жабу',
    intro: 'Бұл параметрлер аппараттың массасына, қуатына, энергия қорына және тәуекеліне әсер етеді.',
    payload: 'Пайдалы жүк артса, ұшу массасы мен қуат қажеттілігі өседі.',
    endurance: 'Ұшу уақыты артса, көбірек энергия қоры керек болады.',
    choices: { electric: 'Электрлік қозғалтқыш жеңіл UAV үшін тиімді.', hybrid: 'Гибридті қозғалтқыш ұзақ миссияға пайдалы.', turbine: 'Микротурбина жоғары қуат береді, бірақ тәуекелді арттырады.', carbon: 'Көміртекті композит массаны азайтады.', aluminum: 'Алюминий прототип үшін ыңғайлы.', titanium: 'Титан ауыр ортаға төзімді.', 'li-ion': 'Li-ion қысқа/орта миссияға жақсы.', 'fuel-cell': 'Сутек элементі ұзақ ұшуға жақсы.', solar: 'Күн көмегі ашық ортада резерв береді.', cold: 'Суықта батареяға термиялық қорғаныс керек.', desert: 'Шаң мен ыстықта салқындату маңызды.', urban: 'Қалада қауіпсіздік пен маневр маңызды.' },
  },
  ru: {
    button: 'Помощь от ИИ',
    title: 'AI объясняет начальные требования',
    close: 'Скрыть',
    intro: 'Эти параметры влияют на массу аппарата, мощность, запас энергии и уровень риска.',
    payload: 'Чем больше полезная нагрузка, тем выше взлётная масса и требуемая мощность.',
    endurance: 'Чем больше время полёта, тем больше нужен запас энергии.',
    choices: { electric: 'Электрический двигатель подходит для компактного UAV.', hybrid: 'Гибридный двигатель полезен для дальних миссий.', turbine: 'Микротурбина даёт высокую мощность, но повышает риск.', carbon: 'Углепластик снижает массу конструкции.', aluminum: 'Алюминий удобен для простого прототипа.', titanium: 'Титан лучше для сложной среды и нагрузки.', 'li-ion': 'Li-ion хорош для короткой и средней миссии.', 'fuel-cell': 'Водородный элемент лучше для долгого полёта.', solar: 'Солнечная поддержка добавляет резерв в открытой среде.', cold: 'В холоде нужна термозащита батареи.', desert: 'В жаре и пыли важны охлаждение и фильтрация.', urban: 'В городе важны безопасность и манёвренность.' },
  },
  en: {
    button: 'AI help',
    title: 'AI explains initial requirements',
    close: 'Hide',
    intro: 'These parameters affect vehicle mass, power, energy reserve, and risk level.',
    payload: 'Higher payload increases takeoff mass and required power.',
    endurance: 'Longer flight time requires a larger energy reserve.',
    choices: { electric: 'Electric engines fit compact UAV missions.', hybrid: 'Hybrid engines help with longer missions.', turbine: 'Micro turbines provide high power but increase risk.', carbon: 'Carbon composite reduces structural mass.', aluminum: 'Aluminum is convenient for simple prototypes.', titanium: 'Titanium is better for harsh environments and loads.', 'li-ion': 'Li-ion works well for short and medium missions.', 'fuel-cell': 'Hydrogen fuel cells are better for long flight.', solar: 'Solar assist adds reserve in open environments.', cold: 'Cold conditions require battery thermal protection.', desert: 'Hot and dusty conditions need cooling and filtering.', urban: 'Urban missions require safety and maneuverability.' },
  },
};

export function MissionAiHelp({ requirements }: Props) {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const copy = text[language];

  return (
    <div className="mission-help">
      <button className="mission-help__button" onClick={() => setIsOpen((open) => !open)} type="button">
        {isOpen ? copy.close : copy.button}
      </button>
      {isOpen && (
        <div className="mission-help__panel">
          <h3>{copy.title}</h3>
          <p>{copy.intro}</p>
          <p>{copy.payload}</p>
          <p>{copy.endurance}</p>
          <p>{copy.choices[requirements.engineType]}</p>
          <p>{copy.choices[requirements.material]}</p>
          <p>{copy.choices[requirements.energySource]}</p>
          <p>{copy.choices[requirements.environment]}</p>
        </div>
      )}
    </div>
  );
}

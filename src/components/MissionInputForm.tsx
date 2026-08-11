import type { MissionRequirements } from '../lib/aerospace';
import { useLanguage, type Language } from '../lib/language';
import { MissionAiHelp } from './MissionAiHelp';

type Props = {
  requirements: MissionRequirements;
  onChange: (next: MissionRequirements) => void;
};

const fields = ['payloadKg', 'enduranceHours', 'rangeKm', 'speedKmh'] as const;

const text: Record<Language, {
  title: string;
  labels: Record<(typeof fields)[number], string>;
  engine: string;
  material: string;
  energy: string;
  environment: string;
  options: Record<string, string>;
}> = {
  kk: {
    title: 'Бастапқы талаптар',
    labels: { payloadKg: 'Пайдалы жүк, кг', enduranceHours: 'Ұшу уақыты, сағ', rangeKm: 'Қашықтық, км', speedKmh: 'Жылдамдық, км/сағ' },
    engine: 'Қозғалтқыш',
    material: 'Материал',
    energy: 'Энергия көзі',
    environment: 'Пайдалану ортасы',
    options: { electric: 'Электрлік', hybrid: 'Гибридті', turbine: 'Микротурбина', carbon: 'Көміртекті композит', aluminum: 'Авиациялық алюминий', titanium: 'Титан рама', 'li-ion': 'Li-ion батарея', 'fuel-cell': 'Сутек отын элементі', solar: 'Күн энергиясы көмегі', cold: 'Суық / жел', desert: 'Ыстық / шаң', urban: 'Қалалық дәліз' },
  },
  ru: {
    title: 'Начальные требования',
    labels: { payloadKg: 'Полезная нагрузка, кг', enduranceHours: 'Время полёта, ч', rangeKm: 'Дальность, км', speedKmh: 'Скорость, км/ч' },
    engine: 'Двигатель',
    material: 'Материал',
    energy: 'Источник энергии',
    environment: 'Среда эксплуатации',
    options: { electric: 'Электрический', hybrid: 'Гибридный', turbine: 'Микротурбина', carbon: 'Углепластик', aluminum: 'Авиационный алюминий', titanium: 'Титановая рама', 'li-ion': 'Li-ion батарея', 'fuel-cell': 'Водородный топливный элемент', solar: 'Солнечная поддержка', cold: 'Холод / ветер', desert: 'Жара / пыль', urban: 'Городской коридор' },
  },
  en: {
    title: 'Initial requirements',
    labels: { payloadKg: 'Payload, kg', enduranceHours: 'Flight time, h', rangeKm: 'Range, km', speedKmh: 'Speed, km/h' },
    engine: 'Engine',
    material: 'Material',
    energy: 'Energy source',
    environment: 'Operating environment',
    options: { electric: 'Electric', hybrid: 'Hybrid', turbine: 'Micro turbine', carbon: 'Carbon composite', aluminum: 'Aerospace aluminum', titanium: 'Titanium frame', 'li-ion': 'Li-ion battery', 'fuel-cell': 'Hydrogen fuel cell', solar: 'Solar assist', cold: 'Cold / wind', desert: 'Hot / dust', urban: 'Urban corridor' },
  },
};

export function MissionInputForm({ requirements, onChange }: Props) {
  const { language } = useLanguage();
  const copy = text[language];

  function updateNumber(field: (typeof fields)[number], value: string) {
    onChange({ ...requirements, [field]: Number(value) });
  }

  function updateText(field: keyof MissionRequirements, value: string) {
    onChange({ ...requirements, [field]: value });
  }

  return (
    <section className="card mission-card">
      <p className="eyebrow">Mission Requirements</p>
      <h2>{copy.title}</h2>
      <MissionAiHelp requirements={requirements} />
      <div className="field-grid">
        {fields.map((field) => (
          <label className="field" key={field}>
            <span>{copy.labels[field]}</span>
            <input
              min="0"
              step="0.1"
              type="number"
              value={requirements[field]}
              onChange={(event) => updateNumber(field, event.target.value)}
            />
          </label>
        ))}
        <label className="field">
          <span>{copy.engine}</span>
          <select
            value={requirements.engineType}
            onChange={(event) => updateText('engineType', event.target.value)}
          >
            <option value="electric">{copy.options.electric}</option>
            <option value="hybrid">{copy.options.hybrid}</option>
            <option value="turbine">{copy.options.turbine}</option>
          </select>
        </label>
        <label className="field">
          <span>{copy.material}</span>
          <select
            value={requirements.material}
            onChange={(event) => updateText('material', event.target.value)}
          >
            <option value="carbon">{copy.options.carbon}</option>
            <option value="aluminum">{copy.options.aluminum}</option>
            <option value="titanium">{copy.options.titanium}</option>
          </select>
        </label>
        <label className="field">
          <span>{copy.energy}</span>
          <select
            value={requirements.energySource}
            onChange={(event) => updateText('energySource', event.target.value)}
          >
            <option value="li-ion">{copy.options['li-ion']}</option>
            <option value="fuel-cell">{copy.options['fuel-cell']}</option>
            <option value="solar">{copy.options.solar}</option>
          </select>
        </label>
        <label className="field">
          <span>{copy.environment}</span>
          <select
            value={requirements.environment}
            onChange={(event) => updateText('environment', event.target.value)}
          >
            <option value="cold">{copy.options.cold}</option>
            <option value="desert">{copy.options.desert}</option>
            <option value="urban">{copy.options.urban}</option>
          </select>
        </label>
      </div>
    </section>
  );
}

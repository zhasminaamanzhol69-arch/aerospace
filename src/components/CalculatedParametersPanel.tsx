import type { CalculatedParameters, MissionRequirements } from '../lib/aerospace';
import { useLanguage, type Language } from '../lib/language';
import './CalculatedParametersPanel.css';

type Props = {
  parameters: CalculatedParameters;
  requirements: MissionRequirements;
};

const keys = ['estimatedTakeoffMassKg', 'requiredPowerW', 'requiredEnergyWh', 'batteryReservePercent', 'designLoadKg', 'riskLevel'] as const;
const units = { estimatedTakeoffMassKg: 'kg', requiredPowerW: 'W', requiredEnergyWh: 'Wh', batteryReservePercent: '%', designLoadKg: 'kg', riskLevel: '' };
const text: Record<Language, {
  title: string;
  adviceTitle: string;
  labels: Record<(typeof keys)[number], string>;
  engine: Record<string, string>;
  material: Record<string, string>;
  energy: Record<string, string>;
  environment: Record<string, string>;
  operation: Record<string, string>;
  risk: Record<string, string>;
}> = {
  kk: {
    title: 'Есептелген қажетті параметрлер',
    adviceTitle: 'Инженерлік кеңестер',
    labels: { estimatedTakeoffMassKg: 'Есептік ұшу массасы', requiredPowerW: 'Қажетті қуат', requiredEnergyWh: 'Энергия қоры', batteryReservePercent: 'Батарея резерві', designLoadKg: 'Есептік жүктеме', riskLevel: 'Тәуекел деңгейі' },
    engine: { electric: 'Қозғалтқыш: электрлік. Қуатты тұрақты ұстайды және шағын UAV үшін тиімді.', hybrid: 'Қозғалтқыш: гибридті. Ұшу қашықтығын арттырады, бірақ масса мен күрделілікті көбейтеді.', turbine: 'Қозғалтқыш: микротурбина. Жоғары қуат береді, бірақ энергия шығыны мен тәуекел өседі.' },
    material: { carbon: 'Материал: көміртекті композит. Масса азайып, ұзақ ұшу тиімді болады.', aluminum: 'Материал: авиациялық алюминий. Прототип үшін қарапайым әрі арзан.', titanium: 'Материал: титан рама. Ыстық орта мен жоғары жүктемеге төзімді.' },
    energy: { 'li-ion': 'Энергия: Li-ion батарея. Қысқа және орта миссияға ыңғайлы.', 'fuel-cell': 'Энергия: сутек отын элементі. Ұзақ ұшу мен үлкен қашықтыққа тиімді.', solar: 'Энергия: күн көмегі. Ашық/ыстық ортада энергия қорын арттырады.' },
    environment: { cold: 'Орта: суық/жел. Қуат пен термиялық қорғанысқа көбірек резерв керек.', desert: 'Орта: ыстық/шаң. Салқындату, фильтр және материал төзімділігі маңызды.', urban: 'Орта: қала. Маневр, қауіпсіздік және шу деңгейі маңызды.' },
    operation: { 'reduce-load': 'Кеңес: жүктемені азайтып немесе қанат ауданын ұлғайту керек.', 'thermal-protection': 'Кеңес: батарея мен электроникаға жылу қорғанысын қосу керек.', 'standard-check': 'Кеңес: стандартты алдын ала тексеріс жеткілікті.' },
    risk: { Low: 'Төмен', Medium: 'Орташа', High: 'Жоғары' },
  },
  ru: {
    title: 'Рассчитанные необходимые параметры',
    adviceTitle: 'Инженерные советы',
    labels: { estimatedTakeoffMassKg: 'Расчётная взлётная масса', requiredPowerW: 'Необходимая мощность', requiredEnergyWh: 'Запас энергии', batteryReservePercent: 'Резерв батареи', designLoadKg: 'Расчётная нагрузка', riskLevel: 'Уровень риска' },
    engine: { electric: 'Двигатель: электрический. Даёт стабильную тягу и подходит для компактного UAV.', hybrid: 'Двигатель: гибридный. Увеличивает дальность, но добавляет массу и сложность.', turbine: 'Двигатель: микротурбина. Даёт высокую мощность, но повышает расход энергии и риск.' },
    material: { carbon: 'Материал: углепластик. Он снижает массу и помогает дальним миссиям.', aluminum: 'Материал: авиационный алюминий. Хорош для простого и недорогого прототипа.', titanium: 'Материал: титановая рама. Лучше для высокой нагрузки и сложной среды.' },
    energy: { 'li-ion': 'Энергия: Li-ion батарея. Подходит для короткой и средней миссии.', 'fuel-cell': 'Энергия: водородный топливный элемент. Лучше для долгого полёта и большой дальности.', solar: 'Энергия: солнечная поддержка. Помогает увеличить запас энергии в открытой среде.' },
    environment: { cold: 'Среда: холод / ветер. Нужен больший резерв мощности и термозащита батареи.', desert: 'Среда: жара / пыль. Важны охлаждение, фильтрация и стойкий материал.', urban: 'Среда: городской коридор. Важны манёвренность, безопасность и шум.' },
    operation: { 'reduce-load': 'Совет: уменьшить полезную нагрузку или увеличить площадь крыла.', 'thermal-protection': 'Совет: добавить термозащиту батареи и электроники.', 'standard-check': 'Совет: достаточно стандартной предполётной проверки.' },
    risk: { Low: 'Низкий', Medium: 'Средний', High: 'Высокий' },
  },
  en: {
    title: 'Calculated required parameters',
    adviceTitle: 'Engineering advice',
    labels: { estimatedTakeoffMassKg: 'Estimated takeoff mass', requiredPowerW: 'Required power', requiredEnergyWh: 'Energy reserve', batteryReservePercent: 'Battery reserve', designLoadKg: 'Design load', riskLevel: 'Risk level' },
    engine: { electric: 'Engine: electric. Provides stable thrust and fits compact UAV missions.', hybrid: 'Engine: hybrid. Extends range but adds mass and system complexity.', turbine: 'Engine: micro turbine. Provides high power but increases energy use and risk.' },
    material: { carbon: 'Material: carbon composite. It reduces mass and supports long missions.', aluminum: 'Material: aerospace aluminum. Good for a simple and affordable prototype.', titanium: 'Material: titanium frame. Better for high load and harsh environments.' },
    energy: { 'li-ion': 'Energy: Li-ion battery. Suitable for short and medium missions.', 'fuel-cell': 'Energy: hydrogen fuel cell. Better for long flight time and high range.', solar: 'Energy: solar assist. Helps increase reserve in open environments.' },
    environment: { cold: 'Environment: cold / wind. More power reserve and battery thermal protection are needed.', desert: 'Environment: hot / dust. Cooling, filtering, and durable materials matter.', urban: 'Environment: urban corridor. Maneuverability, safety, and noise are important.' },
    operation: { 'reduce-load': 'Advice: reduce payload or increase wing area.', 'thermal-protection': 'Advice: add thermal protection for battery and electronics.', 'standard-check': 'Advice: standard preflight validation is enough.' },
    risk: { Low: 'Low', Medium: 'Medium', High: 'High' },
  },
};

export function CalculatedParametersPanel({ parameters, requirements }: Props) {
  const { language } = useLanguage();
  const copy = text[language];

  return (
    <section className="card calculated-panel">
      <div>
        <p className="eyebrow">Calculated Parameters</p>
        <h2>{copy.title}</h2>
      </div>
      <div className="calculated-grid">
        {keys.map((key) => (
          <article className="calculated-metric" key={key}>
            <span>{copy.labels[key]}</span>
            <strong>
              {key === 'riskLevel' ? copy.risk[parameters[key]] : parameters[key]}
              {units[key] && ` ${units[key]}`}
            </strong>
          </article>
        ))}
      </div>
      <div className="advice-panel">
        <h3>{copy.adviceTitle}</h3>
        <p>{copy.engine[requirements.engineType]}</p>
        <p>{copy.material[requirements.material]}</p>
        <p>{copy.energy[requirements.energySource]}</p>
        <p>{copy.environment[requirements.environment]}</p>
        <p>{copy.operation[parameters.operationAdvice]}</p>
      </div>
    </section>
  );
}

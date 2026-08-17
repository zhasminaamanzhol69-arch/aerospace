import type { DesignOption, MissionRequirements } from '../lib/aerospace';
import type { EngineeringStage } from '../lib/engineeringStage';
import { useLanguage, type Language } from '../lib/language';
import './DesignRecommendation.css';

type Props = {
  stage: EngineeringStage;
  options: DesignOption[];
  requirements: MissionRequirements;
};

const text: Record<Language, {
  titles: Record<EngineeringStage, string>;
  labels: string[];
  risk: Record<string, string>;
  summaries: Record<string, string>;
  stageSummaries: Record<EngineeringStage, string>;
  stageOptions: Record<EngineeringStage, string[]>;
}> = {
  kk: {
    titles: { design: 'Ұсынылған конфигурация', manufacturing: 'Өндірістік маршрут', operations: 'Пайдалану регламенті' },
    labels: ['Балл', 'Масса', 'Қуат', 'Тәуекел'],
    risk: { Low: 'Төмен', Medium: 'Орташа', High: 'Жоғары' },
    summaries: { Multirotor: 'Тік ұшу, дәл қону және прототипті сынау үшін қолайлы.', 'Fixed Wing': 'Қашықтық пен ұзақ ұшу үшін ең энергия тиімді нұсқа.', 'Hybrid VTOL': 'Тік старт пен үнемді маршруттық ұшудың теңгерімі.', 'CubeSat / Satellite': 'Орбиталық жүктеме және шағын габарит үшін қолайлы.' },
    stageSummaries: { design: 'Аэродинамика, беріктік, қуат және схема таңдауы бойынша талдау.', manufacturing: 'Материал, қосылыс, өндіріс сериясы және дефектоскопия тәуекелдері.', operations: 'ТО, Digital Twin телеметриясы, RTH және ұшу алдындағы бақылау.' },
    stageOptions: { design: ['Fixed Wing', 'Hybrid VTOL', 'Multirotor', 'CubeSat / Satellite'], manufacturing: ['Допуски', 'Ультрадыбыс', 'Рентген'], operations: ['ТО', 'Digital Twin', 'RTH'] },
  },
  ru: {
    titles: { design: 'Рекомендуемая конфигурация', manufacturing: 'Производственный маршрут', operations: 'Регламент эксплуатации' },
    labels: ['Оценка', 'Масса', 'Мощность', 'Риск'],
    risk: { Low: 'Низкий', Medium: 'Средний', High: 'Высокий' },
    summaries: { Multirotor: 'Лучше для вертикального взлёта, точной посадки и тестов прототипа.', 'Fixed Wing': 'Самый энергоэффективный вариант для дальности и длительного полёта.', 'Hybrid VTOL': 'Компромисс: вертикальный старт плюс экономичный маршрутный полёт.', 'CubeSat / Satellite': 'Подходит для орбитальной полезной нагрузки и ограниченного габарита.' },
    stageSummaries: { design: 'Аэродинамика, прочностной расчёт, расчёт мощности и выбор схемы аппарата.', manufacturing: 'Допуски обработки, технологические риски, ультразвук/рентген и сборка узлов.', operations: 'Регламент ТО, анализ износа по телеметрии цифрового двойника, аварийный возврат и предполётный контроль.' },
    stageOptions: { design: ['Самолётная схема', 'Гибридный вертикальный взлёт', 'Мультиротор', 'Кубсат / спутник'], manufacturing: ['Допуски', 'Ультразвук', 'Рентген'], operations: ['ТО', 'Цифровой двойник', 'Аварийный возврат'] },
  },
  en: {
    titles: { design: 'Recommended configuration', manufacturing: 'Manufacturing route', operations: 'Operations regulation' },
    labels: ['Score', 'Mass', 'Power', 'Risk'],
    risk: { Low: 'Low', Medium: 'Medium', High: 'High' },
    summaries: { Multirotor: 'Best for vertical takeoff, precise landing, and prototype testing.', 'Fixed Wing': 'The most energy-efficient option for range and longer flight time.', 'Hybrid VTOL': 'A compromise between vertical launch and efficient cruise flight.', 'CubeSat / Satellite': 'Fits orbital payload and compact size constraints.' },
    stageSummaries: { design: 'Aerodynamics, structural check, power estimate, and vehicle scheme selection.', manufacturing: 'Machining tolerances, process risks, ultrasound/X-ray NDT, and assembly control.', operations: 'Maintenance rules, Digital Twin telemetry wear analysis, RTH, and preflight control.' },
    stageOptions: { design: ['Fixed Wing', 'Hybrid VTOL', 'Multirotor', 'CubeSat / Satellite'], manufacturing: ['Tolerances', 'Ultrasound', 'X-ray'], operations: ['Maintenance', 'Digital Twin', 'RTH'] },
  },
};

export function DesignRecommendation({ stage, options, requirements }: Props) {
  const { language } = useLanguage();
  const copy = text[language];
  const best = options[0];
  const headline = stage === 'design' ? getDesignHeadline(best.name, requirements, language) : getStageHeadline(stage, requirements, language);

  return (
    <section className="card mission-card recommendation-card">
      <p className="eyebrow">{copy.titles[stage]}</p>
      <h2 className="recommendation-headline">
        <span>{headline.primary}</span>
        <small>{headline.secondary}</small>
      </h2>
      <p className="recommendation-summary">
        {stage === 'design' ? copy.summaries[best.name] : copy.stageSummaries[stage]}
      </p>
      <div className="metric-row">
        <Metric label={copy.labels[0]} value={`${best.score}%`} />
        <Metric label={copy.labels[1]} value={`${best.massKg} kg`} />
        <Metric label={copy.labels[2]} value={`${best.powerW} W`} />
        <Metric label={copy.labels[3]} value={copy.risk[best.risk]} />
      </div>
      <div className="option-list">
        {(stage === 'design' ? getDesignOptions(options, requirements, language) : copy.stageOptions[stage]).map((item, index) => (
          <article className="option-card" key={item}>
            <span>{item}</span>
            <strong>{stage === 'design' ? options[index]?.score : Math.max(58, best.score - index * 7)}%</strong>
          </article>
        ))}
      </div>
      {stage === 'manufacturing' && <MaterialProcessAnalysis />}
    </section>
  );
}

function getDesignHeadline(bestName: string, requirements: MissionRequirements, language: Language) {
  if (requirements.vehicleDomain === 'spacecraft') {
    const orbit = language === 'ru' ? orbitName(requirements.orbitClass) : requirements.orbitClass.toUpperCase();
    return { primary: vehicleName('CubeSat / Satellite', language), secondary: orbit };
  }

  return { primary: vehicleName(bestName, language), secondary: getPropulsion(requirements, language) };
}

function getDesignOptions(options: DesignOption[], requirements: MissionRequirements, language: Language) {
  if (requirements.vehicleDomain === 'spacecraft') {
    if (language === 'ru') return ['Кубсат / спутник', 'Полезная нагрузка на низкой орбите', 'Полезная нагрузка на геостационарной орбите', 'Размещённая полезная нагрузка'];
    return ['CubeSat / Satellite', 'LEO payload', 'GEO payload', 'Hosted payload'];
  }

  return options.map((option) => vehicleName(option.name, language));
}

function MaterialProcessAnalysis() {
  const rows = [
    { material: 'Углепластик', strength: 'Высокая ★★★★★', process: 'Автоклав / вакуум', risk: 'Расслоение' },
    { material: 'Алюминий 7075-Т6', strength: 'Средняя ★★★☆☆', process: 'ЧПУ-фрезерование', risk: 'Коррозия в узлах' },
    { material: 'Титан ВТ6', strength: 'Высокая ★★★★☆', process: 'Сложная ЧПУ / лазер', risk: 'Высокая стоимость' },
  ];

  return (
    <div className="material-analysis">
      <p className="eyebrow">Анализ материалов и процессов</p>
      <div className="material-analysis__grid">
        {rows.map((row) => (
          <article className="material-analysis__item" key={row.material}>
            <h3>{row.material}</h3>
            <p><span>Удельная прочность:</span> {row.strength}</p>
            <p><span>Обработка:</span> {row.process}</p>
            <p><span>Риск:</span> {row.risk}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function getPropulsion(requirements: MissionRequirements, language: Language) {
  const engine = requirements.vehicleScheme === 'cubesat-satellite' ? 'electric / reaction control' : requirements.engineType;
  const source = requirements.energySource === 'li-ion' ? 'Li-Ion/LiPo' : requirements.energySource;
  if (language === 'ru') return `${engineName(engine)}, ${energyName(source)}`;
  return `${engine}, ${source}`;
}

function getStageHeadline(stage: EngineeringStage, requirements: MissionRequirements, language: Language) {
  if (stage === 'manufacturing') return { primary: materialName(requirements.material, language), secondary: jointName(requirements.jointMethod, language) };
  if (language === 'ru') return { primary: environmentName(requirements.environment), secondary: checklistName(requirements.checklistStatus) };
  return { primary: requirements.environment, secondary: requirements.checklistStatus };
}

function vehicleName(name: string, language: Language) {
  if (language !== 'ru') return name;
  if (name === 'Fixed Wing') return 'Самолётная схема';
  if (name === 'Hybrid VTOL') return 'Гибридный вертикальный взлёт';
  if (name === 'Multirotor') return 'Мультиротор';
  if (name === 'CubeSat / Satellite') return 'Кубсат / спутник';
  return name;
}

function orbitName(orbit: string) {
  if (orbit === 'leo') return 'низкая околоземная орбита';
  if (orbit === 'sso') return 'солнечно-синхронная орбита';
  if (orbit === 'geo') return 'геостационарная орбита';
  return orbit;
}

function engineName(engine: string) {
  if (engine === 'electric') return 'электрическая тяга';
  if (engine === 'hybrid') return 'гибридная тяга';
  if (engine === 'turbine') return 'микротурбина';
  if (engine === 'electric / reaction control') return 'электрическая тяга и система ориентации';
  return engine;
}

function energyName(source: string) {
  if (source === 'Li-Ion/LiPo') return 'литий-ионный/литий-полимерный аккумулятор';
  if (source === 'fuel-cell') return 'водородный топливный элемент';
  if (source === 'solar') return 'солнечное питание';
  return source;
}

function materialName(material: string, language: Language) {
  if (language === 'ru') {
    if (material === 'carbon') return 'углепластик';
    if (material === 'titanium') return 'титан';
  }
  if (material === 'aluminum-2024') return 'Al 2024';
  if (material === 'aluminum-7075') return 'Al 7075';
  if (material === 'carbon') return 'CFRP';
  if (material === 'titanium') return 'Titanium';
  return material;
}

function jointName(joint: string, language: Language) {
  if (language !== 'ru') return joint;
  if (joint === 'riveting') return 'клёпка';
  if (joint === 'welding') return 'сварка';
  if (joint === 'laser-welding') return 'лазерная сварка';
  if (joint === 'tig-welding') return 'аргонодуговая сварка';
  if (joint === 'friction-welding') return 'сварка трением';
  if (joint === 'adhesive') return 'клеевое соединение';
  return joint;
}

function environmentName(environment: string) {
  if (environment === 'normal') return 'нормальные условия';
  if (environment === 'cold') return 'экстремальный холод';
  if (environment === 'wind') return 'сильный ветер';
  if (environment === 'space') return 'вакуум и радиация';
  return environment;
}

function checklistName(status: string) {
  if (status === 'ready') return 'готов';
  if (status === 'partial') return 'частично готов';
  if (status === 'blocked') return 'не готов';
  return status;
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

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
    labels: ['Score', 'Mass', 'Power', 'Risk'],
    risk: { Low: 'Low', Medium: 'Medium', High: 'High' },
    summaries: { Multirotor: 'Лучше для вертикального взлёта, точной посадки и тестов прототипа.', 'Fixed Wing': 'Самый энергоэффективный вариант для дальности и длительного полёта.', 'Hybrid VTOL': 'Компромисс: вертикальный старт плюс экономичный маршрутный полёт.', 'CubeSat / Satellite': 'Подходит для орбитальной полезной нагрузки и ограниченного габарита.' },
    stageSummaries: { design: 'Аэродинамика, прочностной расчёт, расчёт мощности и выбор схемы аппарата.', manufacturing: 'Допуски обработки, технологические риски, ультразвук/рентген и сборка узлов.', operations: 'Регламент ТО, анализ износа по телеметрии Digital Twin, RTH и предполётный контроль.' },
    stageOptions: { design: ['Fixed Wing', 'Hybrid VTOL', 'Multirotor', 'CubeSat / Satellite'], manufacturing: ['Допуски', 'Ультразвук', 'Рентген'], operations: ['ТО', 'Digital Twin', 'RTH'] },
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
  const headline = stage === 'design' ? getDesignHeadline(best.name, requirements) : getStageHeadline(stage, requirements);

  return (
    <section className="card mission-card recommendation-card">
      <p className="eyebrow">{copy.titles[stage]}</p>
      <h2>{headline}</h2>
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
        {(stage === 'design' ? getDesignOptions(options, requirements) : copy.stageOptions[stage]).map((item, index) => (
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

function getDesignHeadline(bestName: string, requirements: MissionRequirements) {
  if (requirements.vehicleDomain === 'spacecraft') {
    return `CubeSat / Satellite / ${requirements.orbitClass.toUpperCase()}`;
  }

  return `${bestName} / ${getPropulsion(requirements)}`;
}

function getDesignOptions(options: DesignOption[], requirements: MissionRequirements) {
  if (requirements.vehicleDomain === 'spacecraft') {
    return ['CubeSat / Satellite', 'LEO payload', 'GEO payload', 'Hosted payload'];
  }

  return options.map((option) => option.name);
}

function MaterialProcessAnalysis() {
  const rows = [
    { material: 'CFRP', strength: 'Высокая ★★★★★', process: 'Автоклав / Вакуум', risk: 'Расслоение' },
    { material: 'Al 7075-T6', strength: 'Средняя ★★★☆☆', process: 'ЧПУ фрезерование', risk: 'Коррозия в узлах' },
    { material: 'Ti-6Al-4V', strength: 'Высокая ★★★★☆', process: 'Сложная ЧПУ / Лазер', risk: 'Высокая стоимость' },
  ];

  return (
    <div className="material-analysis">
      <p className="eyebrow">Material & Process Analysis</p>
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

function getPropulsion(requirements: MissionRequirements) {
  const engine = requirements.vehicleScheme === 'cubesat-satellite' ? 'electric / reaction control' : requirements.engineType;
  const source = requirements.energySource === 'li-ion' ? 'Li-Ion/LiPo' : requirements.energySource;
  return `${engine}, ${source}`;
}

function getStageHeadline(stage: EngineeringStage, requirements: MissionRequirements) {
  if (stage === 'manufacturing') return `${materialName(requirements.material)} / ${requirements.jointMethod}`;
  return `${requirements.environment} / ${requirements.checklistStatus}`;
}

function materialName(material: string) {
  if (material === 'aluminum-2024') return 'Al 2024';
  if (material === 'aluminum-7075') return 'Al 7075';
  if (material === 'carbon') return 'CFRP';
  if (material === 'titanium') return 'Titanium';
  return material;
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

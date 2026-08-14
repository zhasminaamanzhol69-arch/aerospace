import { useEffect, useMemo, useState } from 'react';
import type { CalculatedParameters, DesignOption, MissionRequirements } from '../lib/aerospace';
import { buildEngineeringCalculations } from '../lib/engineeringCalculator';
import { downloadEngineeringCsv, downloadEngineeringJson, printEngineeringReport } from '../lib/engineeringExport';
import type { EngineeringStage } from '../lib/engineeringStage';
import {
  bestConfiguration,
  buildDfmItems,
  buildEnergyBreakdown,
  buildMassBreakdown,
  buildTelemetry,
  estimateUnitCost,
} from '../lib/stageInsights';
import { useLanguage, type Language } from '../lib/language';
import './StageEngineeringSuite.css';

type Props = {
  stage: EngineeringStage;
  requirements: MissionRequirements;
  parameters: CalculatedParameters;
  options: DesignOption[];
};

const suiteText: Record<Language, {
  eyebrow: string;
  titles: Record<EngineeringStage, string>;
  exportJson: string;
  exportCsv: string;
  pdf: string;
  mass: string;
  energy: string;
  best: string;
  score: string;
  cost: string;
  diagnostics: string;
}> = {
  kk: {
    eyebrow: 'Аэроғарыштық дашборд модулі',
    titles: { design: 'Жобалау аналитикасы', manufacturing: 'Технологиялық бақылау және құн', operations: 'Нақты уақыттағы телеметрия' },
    exportJson: 'JSON экспорт',
    exportCsv: 'CSV экспорт',
    pdf: 'PDF есеп',
    mass: 'Масса үлестірімі',
    energy: 'Энергия балансы',
    best: 'Үздік конфигурация',
    score: 'Баға',
    cost: 'Бір бұйымның болжамды құны',
    diagnostics: 'AI диагностикасы',
  },
  ru: {
    eyebrow: 'Модуль аэрокосмического дашборда',
    titles: { design: 'Аналитика проектирования', manufacturing: 'Технологичность и стоимость', operations: 'Телеметрия в реальном времени' },
    exportJson: 'Экспорт JSON',
    exportCsv: 'Экспорт CSV',
    pdf: 'PDF-отчёт',
    mass: 'Распределение массы',
    energy: 'Энергетический баланс',
    best: 'Лучшая конфигурация',
    score: 'Оценка',
    cost: 'Оценочная стоимость единицы',
    diagnostics: 'AI-диагностика',
  },
  en: {
    eyebrow: 'Aerospace Dashboard Module',
    titles: { design: 'Design Analytics', manufacturing: 'DFM & Cost Control', operations: 'Live Telemetry' },
    exportJson: 'Export JSON',
    exportCsv: 'Export CSV',
    pdf: 'PDF Report',
    mass: 'Mass Breakdown',
    energy: 'Energy Balance',
    best: 'Best configuration',
    score: 'Score',
    cost: 'Estimated unit cost',
    diagnostics: 'AI diagnostics',
  },
};

export function StageEngineeringSuite({ stage, requirements, parameters, options }: Props) {
  const { language } = useLanguage();
  const text = suiteText[language];
  const calculations = useMemo(() => buildEngineeringCalculations(requirements, parameters), [requirements, parameters]);
  const mass = useMemo(() => buildMassBreakdown(requirements, parameters), [requirements, parameters]);
  const energy = useMemo(() => buildEnergyBreakdown(requirements, parameters), [requirements, parameters]);
  const dfmItems = useMemo(() => buildDfmItems(requirements), [requirements]);
  const [telemetry, setTelemetry] = useState(() => buildTelemetry(requirements, parameters));

  useEffect(() => {
    if (stage !== 'operations') return undefined;
    const timer = window.setInterval(() => setTelemetry(buildTelemetry(requirements, parameters)), 1000);
    return () => window.clearInterval(timer);
  }, [stage, requirements, parameters]);

  return (
    <section className="card stage-suite">
      <SuiteHeader stage={stage} text={text} />
      {stage === 'design' && <DesignSuite mass={mass} energy={energy} options={options} text={text} />}
      {stage === 'manufacturing' && <ManufacturingSuite items={dfmItems} cost={estimateUnitCost(requirements, parameters)} text={text} />}
      {stage === 'operations' && <OperationsSuite telemetry={telemetry} recommendation={parameters.operationAdvice} text={text} />}
      <div className="stage-suite__actions">
        <button type="button" onClick={() => downloadEngineeringJson(stage, requirements, parameters, options, calculations)}>{text.exportJson}</button>
        <button type="button" onClick={() => downloadEngineeringCsv(parameters, calculations)}>{text.exportCsv}</button>
        <button type="button" onClick={() => printEngineeringReport(calculations)}>{text.pdf}</button>
      </div>
    </section>
  );
}

function SuiteHeader({ stage, text }: { stage: EngineeringStage; text: typeof suiteText.ru }) {
  return (
    <div>
      <p className="eyebrow">{text.eyebrow}</p>
      <h2>{text.titles[stage]}</h2>
    </div>
  );
}

function DesignSuite({ mass, energy, options, text }: { mass: ReturnType<typeof buildMassBreakdown>; energy: ReturnType<typeof buildEnergyBreakdown>; options: DesignOption[]; text: typeof suiteText.ru }) {
  const best = bestConfiguration(options);
  return (
    <>
      <Chart title={text.mass} items={mass} />
      <Chart title={text.energy} items={energy} />
      <div className="stage-suite__table">
        {options.map((option) => <span key={option.name}>{option.name}: {option.score}% / {option.massKg}kg / {option.powerW}W / {option.risk}</span>)}
      </div>
      {best && <strong className="stage-suite__note">{text.best}: {best.name} — {text.score} {best.score}%</strong>}
    </>
  );
}

function ManufacturingSuite({ items, cost, text }: { items: ReturnType<typeof buildDfmItems>; cost: number; text: typeof suiteText.ru }) {
  return (
    <>
      <div className="stage-suite__table">
        {items.map((item) => <span className={item.status === 'Warning' ? 'is-warning' : ''} key={item.label}>{item.label}: {item.status} — {item.note}</span>)}
      </div>
      <strong className="stage-suite__note">{text.cost}: ${cost}</strong>
    </>
  );
}

function OperationsSuite({ telemetry, recommendation, text }: { telemetry: ReturnType<typeof buildTelemetry>; recommendation: string; text: typeof suiteText.ru }) {
  return (
    <>
      <div className="telemetry-live">
        {Object.entries(telemetry).map(([key, value]) => <span key={key}>{key.toUpperCase()}: <strong>{value}</strong></span>)}
      </div>
      <strong className="stage-suite__note">{text.diagnostics}: {recommendation}</strong>
    </>
  );
}

function Chart({ title, items }: { title: string; items: { label: string; percent: number }[] }) {
  return (
    <div className="stage-chart">
      <h3>{title}</h3>
      {items.map((item) => (
        <label key={item.label}>
          <span>{item.label}</span>
          <i style={{ width: `${item.percent}%` }} />
          <strong>{item.percent}%</strong>
        </label>
      ))}
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import type { CalculatedParameters, DesignOption, MissionRequirements } from '../lib/aerospace';
import { buildEngineeringCalculations } from '../lib/engineeringCalculator';
import { downloadEngineeringCsv, downloadEngineeringJson, printEngineeringReport } from '../lib/engineeringExport';
import type { EngineeringStage } from '../lib/engineeringStage';
import { useLanguage, type Language } from '../lib/language';
import {
  bestConfiguration,
  buildDfmItems,
  buildEnergyBreakdown,
  buildMassBreakdown,
  buildTelemetry,
  estimateUnitCost,
} from '../lib/stageInsights';
import './StageEngineeringSuite.css';

type Props = {
  stage: EngineeringStage;
  requirements: MissionRequirements;
  parameters: CalculatedParameters;
  options: DesignOption[];
};

const suiteText = {
  kk: { eyebrow: 'Аэроғарыштық бақылау тақтасының модулі', titles: { design: 'Жобалау аналитикасы', manufacturing: 'Өндіріс және құнды бақылау', operations: 'Тікелей телеметрия' }, mass: 'Масса құрылымы', energy: 'Энергия теңгерімі', best: 'Үздік конфигурация', score: 'Баға', cost: 'Бір дананың болжамды құны', diagnostics: 'AI диагностикасы', json: 'JSON экспорттау', csv: 'CSV экспорттау', pdf: 'PDF классика', vectorPdf: 'PDF вектор' },
  ru: { eyebrow: 'Модуль аэрокосмической панели', titles: { design: 'Аналитика проектирования', manufacturing: 'Производство и контроль стоимости', operations: 'Телеметрия в реальном времени' }, mass: 'Распределение массы', energy: 'Энергетический баланс', best: 'Лучшая конфигурация', score: 'Оценка', cost: 'Ориентировочная стоимость единицы', diagnostics: 'Диагностика ИИ', json: 'Экспорт JSON', csv: 'Экспорт CSV', pdf: 'PDF классика', vectorPdf: 'PDF вектор' },
  en: { eyebrow: 'Aerospace Dashboard Module', titles: { design: 'Design Analytics', manufacturing: 'DFM & Cost Control', operations: 'Live Telemetry' }, mass: 'Mass Breakdown', energy: 'Energy Balance', best: 'Best configuration', score: 'Score', cost: 'Estimated unit cost', diagnostics: 'AI diagnostics', json: 'Export JSON', csv: 'Export CSV', pdf: 'PDF Classic', vectorPdf: 'PDF Vector' },
} satisfies Record<Language, Record<string, unknown>>;

export function StageEngineeringSuite({ stage, requirements, parameters, options }: Props) {
  const { language } = useLanguage();
  const copy = suiteText[language];
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
      <SuiteHeader stage={stage} copy={copy} />
      {stage === 'design' && <DesignSuite mass={mass} energy={energy} options={options} copy={copy} language={language} />}
      {stage === 'manufacturing' && <ManufacturingSuite items={dfmItems} cost={estimateUnitCost(requirements, parameters)} copy={copy} language={language} />}
      {stage === 'operations' && <OperationsSuite telemetry={telemetry} recommendation={parameters.operationAdvice} copy={copy} language={language} />}
      <div className="stage-suite__actions">
        <button type="button" onClick={() => downloadEngineeringJson(stage, requirements, parameters, options, calculations)}>{copy.json}</button>
        <button type="button" onClick={() => downloadEngineeringCsv(parameters, calculations)}>{copy.csv}</button>
        <button type="button" onClick={() => printEngineeringReport(calculations, 'classic')}>{copy.pdf}</button>
        <button type="button" onClick={() => printEngineeringReport(calculations, 'vector')}>{copy.vectorPdf}</button>
      </div>
    </section>
  );
}

type SuiteCopy = typeof suiteText.ru;

function SuiteHeader({ stage, copy }: { stage: EngineeringStage; copy: SuiteCopy }) {
  return (
    <div>
      <p className="eyebrow">{copy.eyebrow}</p>
      <h2>{copy.titles[stage]}</h2>
    </div>
  );
}

function DesignSuite({ mass, energy, options, copy, language }: { mass: ReturnType<typeof buildMassBreakdown>; energy: ReturnType<typeof buildEnergyBreakdown>; options: DesignOption[]; copy: SuiteCopy; language: Language }) {
  const best = bestConfiguration(options);
  return (
    <>
      <Chart title={copy.mass} items={translateChartItems(mass, language)} />
      <Chart title={copy.energy} items={translateChartItems(energy, language)} />
      <div className="stage-suite__table">
        {options.map((option) => (
          <span key={option.name}>
            {designOptionName(option.name, language)}: {option.score}% / {option.massKg} {language === 'ru' ? 'кг' : 'kg'} / {option.powerW} {language === 'ru' ? 'Вт' : 'W'} / {riskName(option.risk, language)}
          </span>
        ))}
      </div>
      {best && <strong className="stage-suite__note">{copy.best}: {designOptionName(best.name, language)} — {copy.score} {best.score}%</strong>}
    </>
  );
}

function ManufacturingSuite({ items, cost, copy, language }: { items: ReturnType<typeof buildDfmItems>; cost: number; copy: SuiteCopy; language: Language }) {
  return (
    <>
      <div className="stage-suite__table">
        {items.map((item) => (
          <span className={item.status === 'Warning' ? 'is-warning' : ''} key={item.label}>
            {item.label}: {statusName(item.status, language)} — {item.note}
          </span>
        ))}
      </div>
      <strong className="stage-suite__note">{copy.cost}: ${cost}</strong>
    </>
  );
}

function OperationsSuite({ telemetry, recommendation, copy, language }: { telemetry: ReturnType<typeof buildTelemetry>; recommendation: string; copy: SuiteCopy; language: Language }) {
  return (
    <>
      <div className="telemetry-live">
        {Object.entries(telemetry).map(([key, value]) => (
          <span key={key}>{telemetryLabel(key, language)}: <strong>{telemetryValue(key, value, language)}</strong></span>
        ))}
      </div>
      <strong className="stage-suite__note">{copy.diagnostics}: {operationAdviceName(recommendation, language)}</strong>
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

function translateChartItems(items: { label: string; percent: number }[], language: Language) {
  if (language !== 'ru') return items;
  return items.map((item) => ({ ...item, label: chartLabel(item.label) }));
}

function chartLabel(label: string) {
  if (label === 'Payload') return 'Полезная нагрузка';
  if (label === 'Energy') return 'Энергия';
  if (label === 'Propulsion') return 'Тяга';
  if (label === 'Structure') return 'Конструкция';
  if (label === 'Avionics') return 'Авионика';
  if (label === 'Reserve') return 'Резерв';
  return label;
}

function designOptionName(name: string, language: Language) {
  if (language !== 'ru') return name;
  if (name === 'Fixed Wing') return 'Самолётная схема';
  if (name === 'Hybrid VTOL') return 'Гибридный вертикальный взлёт';
  if (name === 'Multirotor') return 'Мультиротор';
  if (name === 'CubeSat / Satellite') return 'Кубсат / спутник';
  return name;
}

function riskName(risk: string, language: Language) {
  if (language !== 'ru') return risk;
  if (risk === 'Low') return 'низкий риск';
  if (risk === 'Medium') return 'средний риск';
  if (risk === 'High') return 'высокий риск';
  return risk;
}

function statusName(status: string, language: Language) {
  if (language !== 'ru') return status;
  if (status === 'Warning') return 'предупреждение';
  if (status === 'OK') return 'норма';
  return status;
}

function telemetryLabel(key: string, language: Language) {
  if (language !== 'ru') return key.toUpperCase();
  if (key === 'altitude') return 'ВЫСОТА';
  if (key === 'speed') return 'СКОРОСТЬ';
  if (key === 'battery') return 'АККУМУЛЯТОР';
  if (key === 'temperature') return 'ТЕМПЕРАТУРА';
  if (key === 'vibration') return 'ВИБРАЦИЯ';
  if (key === 'status') return 'СТАТУС';
  return key.toUpperCase();
}

function telemetryValue(key: string, value: string, language: Language) {
  if (language !== 'ru') return value;
  if (key === 'status') return statusName(value, language);
  return value
    .replace('km/h', 'км/ч')
    .replace('km', 'км')
    .replace('m', 'м');
}

function operationAdviceName(advice: string, language: Language) {
  if (language !== 'ru') return advice;
  if (advice === 'reduce-load') return 'снизить нагрузку и оставить больший резерв';
  if (advice === 'thermal-protection') return 'усилить термозащиту и проверить температурный режим';
  if (advice === 'standard-check') return 'выполнить стандартную проверку перед продолжением';
  return advice;
}

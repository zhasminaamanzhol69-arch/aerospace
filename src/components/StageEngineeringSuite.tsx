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
import './StageEngineeringSuite.css';

type Props = {
  stage: EngineeringStage;
  requirements: MissionRequirements;
  parameters: CalculatedParameters;
  options: DesignOption[];
};

export function StageEngineeringSuite({ stage, requirements, parameters, options }: Props) {
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
      <SuiteHeader stage={stage} />
      {stage === 'design' && <DesignSuite mass={mass} energy={energy} options={options} />}
      {stage === 'manufacturing' && <ManufacturingSuite items={dfmItems} cost={estimateUnitCost(requirements, parameters)} />}
      {stage === 'operations' && <OperationsSuite telemetry={telemetry} recommendation={parameters.operationAdvice} />}
      <div className="stage-suite__actions">
        <button type="button" onClick={() => downloadEngineeringJson(stage, requirements, parameters, options, calculations)}>Export JSON</button>
        <button type="button" onClick={() => downloadEngineeringCsv(parameters, calculations)}>Export CSV</button>
        <button type="button" onClick={() => printEngineeringReport(calculations)}>PDF Report</button>
      </div>
    </section>
  );
}

function SuiteHeader({ stage }: { stage: EngineeringStage }) {
  const title = stage === 'design' ? 'Design Analytics' : stage === 'manufacturing' ? 'DFM & Cost Control' : 'Live Telemetry';
  return (
    <div>
      <p className="eyebrow">Aerospace Dashboard Module</p>
      <h2>{title}</h2>
    </div>
  );
}

function DesignSuite({ mass, energy, options }: { mass: ReturnType<typeof buildMassBreakdown>; energy: ReturnType<typeof buildEnergyBreakdown>; options: DesignOption[] }) {
  const best = bestConfiguration(options);
  return (
    <>
      <Chart title="Mass Breakdown" items={mass} />
      <Chart title="Energy Balance" items={energy} />
      <div className="stage-suite__table">
        {options.map((option) => <span key={option.name}>{option.name}: {option.score}% / {option.massKg}kg / {option.powerW}W / {option.risk}</span>)}
      </div>
      {best && <strong className="stage-suite__note">Best configuration: {best.name} — Score {best.score}%</strong>}
    </>
  );
}

function ManufacturingSuite({ items, cost }: { items: ReturnType<typeof buildDfmItems>; cost: number }) {
  return (
    <>
      <div className="stage-suite__table">
        {items.map((item) => <span className={item.status === 'Warning' ? 'is-warning' : ''} key={item.label}>{item.label}: {item.status} — {item.note}</span>)}
      </div>
      <strong className="stage-suite__note">Estimated unit cost: ${cost}</strong>
    </>
  );
}

function OperationsSuite({ telemetry, recommendation }: { telemetry: ReturnType<typeof buildTelemetry>; recommendation: string }) {
  return (
    <>
      <div className="telemetry-live">
        {Object.entries(telemetry).map(([key, value]) => <span key={key}>{key.toUpperCase()}: <strong>{value}</strong></span>)}
      </div>
      <strong className="stage-suite__note">AI diagnostics: {recommendation}</strong>
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

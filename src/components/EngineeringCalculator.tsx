import { useMemo, useState } from 'react';
import type { CalculatedParameters, MissionRequirements } from '../lib/aerospace';
import { buildEngineeringCalculations } from '../lib/engineeringCalculator';
import './EngineeringCalculator.css';

type Props = {
  requirements: MissionRequirements;
  parameters: CalculatedParameters;
};

export function EngineeringCalculator({ requirements, parameters }: Props) {
  const calculations = useMemo(
    () => buildEngineeringCalculations(requirements, parameters),
    [requirements, parameters],
  );
  const [selectedId, setSelectedId] = useState(calculations[0].id);
  const selected = calculations.find((item) => item.id === selectedId) ?? calculations[0];

  return (
    <section className="card engineering-calculator">
      <div className="calculator-header">
        <div>
          <p className="eyebrow">Engineering Calculator</p>
          <h2>Инженерный калькулятор</h2>
          <p>Формула, исходные данные, единицы измерения и расчётный результат.</p>
        </div>
      </div>

      <div className="calculator-tabs" aria-label="Engineering calculation types">
        {calculations.map((item) => (
          <button
            className={item.id === selected.id ? 'is-active' : ''}
            key={item.id}
            onClick={() => setSelectedId(item.id)}
            type="button"
          >
            {item.title}
          </button>
        ))}
      </div>

      <article className="calculator-result">
        <div>
          <span>Выбранный расчёт</span>
          <h3>{selected.title}</h3>
        </div>
        <div className="formula-box">
          <span>Формула</span>
          <strong>{selected.formula}</strong>
        </div>
        <div className="input-list">
          <span>Исходные данные</span>
          {selected.inputs.map((input) => (
            <strong key={input}>{input}</strong>
          ))}
        </div>
        <div className="result-box">
          <span>Результат</span>
          <strong>{selected.result}</strong>
        </div>
        <p>{selected.note}</p>
      </article>

      <div className="calculator-grid">
        {calculations.map((item) => (
          <article key={item.id}>
            <span>{item.title}</span>
            <strong>{item.result}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

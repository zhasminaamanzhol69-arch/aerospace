import { useMemo, useState } from 'react';
import type { CalculatedParameters, MissionRequirements } from '../lib/aerospace';
import { buildEngineeringCalculations } from '../lib/engineeringCalculator';
import { useLanguage, type Language } from '../lib/language';
import './EngineeringCalculator.css';

type Props = {
  requirements: MissionRequirements;
  parameters: CalculatedParameters;
};

const calculatorText: Record<Language, {
  eyebrow: string;
  title: string;
  body: string;
  selected: string;
  formula: string;
  inputs: string;
  result: string;
}> = {
  kk: {
    eyebrow: 'Инженерлік калькулятор',
    title: 'Инженерлік есептеулер',
    body: 'Формула, бастапқы деректер, өлшем бірліктері және есептеу нәтижесі.',
    selected: 'Таңдалған есеп',
    formula: 'Формула',
    inputs: 'Бастапқы деректер',
    result: 'Нәтиже',
  },
  ru: {
    eyebrow: 'Инженерный калькулятор',
    title: 'Инженерные расчёты',
    body: 'Формула, исходные данные, единицы измерения и расчётный результат.',
    selected: 'Выбранный расчёт',
    formula: 'Формула',
    inputs: 'Исходные данные',
    result: 'Результат',
  },
  en: {
    eyebrow: 'Engineering Calculator',
    title: 'Engineering Calculator',
    body: 'Formula, input data, units, and calculated result.',
    selected: 'Selected calculation',
    formula: 'Formula',
    inputs: 'Input data',
    result: 'Result',
  },
};

export function EngineeringCalculator({ requirements, parameters }: Props) {
  const { language } = useLanguage();
  const copy = calculatorText[language];
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
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2>{copy.title}</h2>
          <p>{copy.body}</p>
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
          <span>{copy.selected}</span>
          <h3>{selected.title}</h3>
        </div>
        <div className="formula-box">
          <span>{copy.formula}</span>
          <strong>{selected.formula}</strong>
        </div>
        <div className="input-list">
          <span>{copy.inputs}</span>
          {selected.inputs.map((input) => (
            <strong key={input}>{input}</strong>
          ))}
        </div>
        <div className="result-box">
          <span>{copy.result}</span>
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

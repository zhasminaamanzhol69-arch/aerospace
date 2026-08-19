import { useMemo, useState } from 'react';
import type { CalculatedParameters, MissionRequirements } from '../lib/aerospace';
import { buildEngineeringCalculations } from '../lib/engineeringCalculator';
import { useLanguage, type Language } from '../lib/language';
import './EngineeringCalculator.css';

type Props = {
  requirements: MissionRequirements;
  parameters: CalculatedParameters;
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
    <section className="card engineering-calculator" id="engineering-calculator">
      <div className="calculator-header">
        <div>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2>{copy.title}</h2>
          <p>{copy.body}</p>
        </div>
      </div>

      <div className="calculator-tabs" aria-label={copy.tabsLabel}>
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
        {calculations.map((item) => {
          const preview = formatResultPreview(item.id, item.result);
          return (
            <article key={item.id}>
              <span>{getPreviewTitle(item.id, item.title)}</span>
              <strong>{preview.value}</strong>
              {preview.detail && <small>{preview.detail}</small>}
            </article>
          );
        })}
      </div>
    </section>
  );
}

const calculatorText: Record<Language, {
  eyebrow: string; title: string; body: string; tabsLabel: string;
  selected: string; formula: string; inputs: string; result: string;
}> = {
  kk: { eyebrow: 'Инженерлік калькулятор', title: 'Инженерлік калькулятор', body: 'Формула, бастапқы деректер, өлшем бірліктері және есептеу нәтижесі.', tabsLabel: 'Инженерлік есептеу түрлері', selected: 'Таңдалған есептеу', formula: 'Формула', inputs: 'Бастапқы деректер', result: 'Нәтиже' },
  ru: { eyebrow: 'Инженерный калькулятор', title: 'Инженерный калькулятор', body: 'Формула, исходные данные, единицы измерения и расчётный результат.', tabsLabel: 'Виды инженерных расчётов', selected: 'Выбранный расчёт', formula: 'Формула', inputs: 'Исходные данные', result: 'Результат' },
  en: { eyebrow: 'Engineering Calculator', title: 'Engineering calculator', body: 'Formula, input data, units, and calculation result.', tabsLabel: 'Engineering calculation types', selected: 'Selected calculation', formula: 'Formula', inputs: 'Input data', result: 'Result' },
};

function getPreviewTitle(id: string, title: string) {
  if (id === 'stress') return 'Прочность';
  if (id === 'mass') return 'Масса конструкции';
  if (id === 'thermal') return 'Тепло';
  if (id === 'consumption') return 'Энергия';
  if (id === 'tolerance') return 'Допуск';
  return title;
}

function formatResultPreview(id: string, result: string) {
  if (id === 'cg') return splitPreview(result, ' от ');
  if (id === 'aero') {
    const [pressure = result, lift = '', drag = ''] = result.split('; ');
    return { value: pressure.replace('напор ', ''), detail: [lift, drag].filter(Boolean).join(' / ') };
  }
  if (id === 'thermal') return splitPreview(result, ' тепловой');
  if (id === 'margin') return { value: result.replace('запас ', ''), detail: 'запас прочности' };
  return { value: result, detail: '' };
}

function splitPreview(result: string, separator: string) {
  const [value, detail] = result.split(separator);
  return { value, detail: detail ? `${separator.trim()} ${detail}` : '' };
}

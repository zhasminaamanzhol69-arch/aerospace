import { useState } from 'react';
import { useLanguage, type Language } from '../lib/language';
import './AgentWorkflow.css';

const text: Record<Language, {
  title: string;
  start: string;
  next: string;
  restart: string;
  waiting: string;
  steps: Array<{ title: string; result: string }>;
}> = {
  kk: {
    title: 'Агент қалай жұмыс істейді',
    start: 'Талдауды бастау',
    next: 'Келесі кезең',
    restart: 'Қайта бастау',
    waiting: 'Іске қосуды күтуде',
    steps: [
      { title: 'Талаптарды талдайды', result: 'Жүк, ұшу уақыты, қашықтық және орта қабылданды.' },
      { title: 'Қажетті параметрлерді есептейді', result: 'Масса, қуат және энергия қоры бағаланды.' },
      { title: 'Конструкциялық нұсқалар ұсынады', result: 'Fixed Wing, Quad VTOL және Hybrid VTOL нұсқалары жасалды.' },
      { title: 'Аэродинамика мен энергияны тексереді', result: 'Қанат тиімділігі, тарту күші және энергия шығыны салыстырылды.' },
      { title: 'Техникалық тәуекелдерді анықтайды', result: 'Артық жүктеме, суық, батарея және жинау күрделілігі тексерілді.' },
      { title: 'Тиімді шешімді ұсынады', result: 'Ең жақсы нұсқа score, power, mass және risk бойынша таңдалды.' },
    ],
  },
  ru: {
    title: 'Как работает агент',
    start: 'Запустить анализ',
    next: 'Следующий этап',
    restart: 'Запустить заново',
    waiting: 'Ожидает запуска',
    steps: [
      { title: 'Анализирует требования', result: 'Payload, время полёта, дальность и среда эксплуатации приняты.' },
      { title: 'Рассчитывает необходимые параметры', result: 'Оценены масса аппарата, мощность и запас энергии.' },
      { title: 'Предлагает конструктивные варианты', result: 'Сформированы варианты Fixed Wing, Quad VTOL и Hybrid VTOL.' },
      { title: 'Проверяет аэродинамику и энергетику', result: 'Сравнены эффективность крыла, тяга и расход энергии.' },
      { title: 'Определяет технические риски', result: 'Проверены перегрузка, холод, батарея и сложность сборки.' },
      { title: 'Рекомендует эффективное решение', result: 'Лучший вариант выбран по score, power, mass и risk.' },
    ],
  },
  en: {
    title: 'How the agent works',
    start: 'Start analysis',
    next: 'Next stage',
    restart: 'Restart',
    waiting: 'Waiting to start',
    steps: [
      { title: 'Analyzes requirements', result: 'Payload, flight time, range, and operating environment are accepted.' },
      { title: 'Calculates required parameters', result: 'Vehicle mass, power, and energy reserve are estimated.' },
      { title: 'Proposes design options', result: 'Fixed Wing, Quad VTOL, and Hybrid VTOL options are generated.' },
      { title: 'Checks aerodynamics and energy', result: 'Wing efficiency, thrust, and energy consumption are compared.' },
      { title: 'Identifies technical risks', result: 'Overload, cold, battery, and assembly complexity are checked.' },
      { title: 'Recommends an efficient solution', result: 'The best option is selected by score, power, mass, and risk.' },
    ],
  },
};

export function AgentWorkflow() {
  const { language } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);
  const copy = text[language];
  const isComplete = activeStep === copy.steps.length;

  function handleNext() {
    setActiveStep((current) => (current >= copy.steps.length ? 0 : current + 1));
  }

  return (
    <section className="card mission-card agent-workflow">
      <div className="workflow-header">
        <div>
          <p className="eyebrow">AI Engineering Agent</p>
          <h2>{copy.title}</h2>
        </div>
        <button type="button" onClick={handleNext}>
          {activeStep === 0 ? copy.start : isComplete ? copy.restart : copy.next}
        </button>
      </div>
      <ol className="workflow-list">
        {copy.steps.map((step, index) => (
          <li
            className={index < activeStep ? 'is-done' : index === activeStep ? 'is-active' : ''}
            key={step.title}
          >
            <strong>{step.title}</strong>
            <span>{index < activeStep ? step.result : copy.waiting}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

import { useState } from 'react';
import type { EngineeringStage } from '../lib/engineeringStage';
import { useLanguage, type Language } from '../lib/language';
import type { VehicleDomain } from '../lib/vehicleDomain';
import './AgentWorkflow.css';

type Props = {
  stage: EngineeringStage;
  domain: VehicleDomain;
};

const text: Record<Language, {
  title: Record<EngineeringStage, string>;
  start: string;
  next: string;
  restart: string;
  waiting: string;
  steps: Record<EngineeringStage, Array<{ title: string; result: string }>>;
}> = {
  kk: {
    title: { design: 'Жобалау агенті қалай жұмыс істейді', manufacturing: 'Өндіріс агенті қалай жұмыс істейді', operations: 'Пайдалану агенті қалай жұмыс істейді' },
    start: 'Талдауды бастау',
    next: 'Келесі кезең',
    restart: 'Қайта бастау',
    waiting: 'Іске қосуды күтуде',
    steps: {
      design: [
        { title: 'Миссияны талдайды', result: 'Пайдалы жүк, ұшу массасы, орбита/биіктік және габарит қабылданды.' },
        { title: 'Геометрияны есептейді', result: 'Қанат ауданы, құлаш, аэродинамикалық сапа және жүктеме бағаланды.' },
        { title: 'Архитектураны таңдайды', result: 'Самолёт схемасы, тік ұшу, мультиротор және спутник салыстырылды.' },
      ],
      manufacturing: [
        { title: 'Материалды талдайды', result: 'Көмірпластик, алюминий, титан немесе 3D материал таңдалды.' },
        { title: 'Процесті бағалайды', result: 'ЧПУ, автоклав, инфузия немесе 3D өндіріс тексерілді.' },
        { title: 'Сапа бақылауын таңдайды', result: 'Рұқсат, дайындау уақыты және дефектоскопия әдісі ұсынылды.' },
      ],
      operations: [
        { title: 'Телеметрияны оқиды', result: 'Аккумулятор күйі, байланыс сигналы, температура және кідіріс қабылданды.' },
        { title: 'Цифрлық егізді жаңартады', result: 'Виртуалды модель аппарат күйін қайталады.' },
        { title: 'Қызмет пен авариялық қайтуды ұсынады', result: 'Ақау, ресурс және қауіпсіздік шектеуі анықталды.' },
      ],
    },
  },
  ru: {
    title: { design: 'Как работает агент проектирования', manufacturing: 'Как работает агент производства', operations: 'Как работает агент эксплуатации' },
    start: 'Запустить анализ',
    next: 'Следующий этап',
    restart: 'Запустить заново',
    waiting: 'Ожидает запуска',
    steps: {
      design: [
        { title: 'Анализирует миссию', result: 'Полезная нагрузка, взлётная масса, высота/орбита и габариты приняты.' },
        { title: 'Считает геометрию', result: 'Оценены площадь, размах, аэродинамическое качество и нагрузка на крыло/диск.' },
        { title: 'Выбирает архитектуру', result: 'Сравнены самолётная схема, вертикальный взлёт, мультиротор и спутник.' },
      ],
      manufacturing: [
        { title: 'Анализирует материал', result: 'Проверены углепластик, алюминий, титан и 3D-печать.' },
        { title: 'Оценивает процесс', result: 'Сравнены ЧПУ, автоклав, инфузия и аддитивное производство.' },
        { title: 'Назначает контроль качества', result: 'Рассчитаны допуск, срок изготовления и метод дефектоскопии.' },
      ],
      operations: [
        { title: 'Читает телеметрию', result: 'Приняты состояние аккумулятора, сигнал связи, температура, задержка и наработка.' },
        { title: 'Обновляет цифровой двойник', result: 'Виртуальная модель повторяет текущее состояние аппарата.' },
        { title: 'Назначает ТО и аварийный возврат', result: 'Определены аномалии, ресурс и ограничения эксплуатации.' },
      ],
    },
  },
  en: {
    title: { design: 'How the design agent works', manufacturing: 'How the manufacturing agent works', operations: 'How the operations agent works' },
    start: 'Start analysis',
    next: 'Next stage',
    restart: 'Restart',
    waiting: 'Waiting to start',
    steps: {
      design: [
        { title: 'Analyzes mission', result: 'Payload, MTOW, altitude/orbit, and size limits are accepted.' },
        { title: 'Calculates geometry', result: 'S, b, L/D, and wing/disk loading are estimated.' },
        { title: 'Selects architecture', result: 'Fixed Wing, VTOL, Multirotor, and Satellite are compared.' },
      ],
      manufacturing: [
        { title: 'Analyzes material', result: 'CFRP, aluminum, titanium, and 3D-print options are checked.' },
        { title: 'Evaluates process', result: 'CNC, autoclave, infusion, and additive routes are compared.' },
        { title: 'Assigns quality control', result: 'Tolerance, lead time, and NDT method are selected.' },
      ],
      operations: [
        { title: 'Reads telemetry', result: 'SoH, RSSI, temperature, latency, and flight hours are accepted.' },
        { title: 'Updates Digital Twin', result: 'The virtual model mirrors the vehicle state.' },
        { title: 'Sets service and RTH', result: 'Anomalies, service life, and operating limits are defined.' },
      ],
    },
  },
};

export function AgentWorkflow({ stage, domain }: Props) {
  const { language } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);
  const copy = text[language];
  const steps = buildDomainSteps(copy.steps[stage], stage, domain, language);
  const isComplete = activeStep === steps.length;

  function handleNext() {
    setActiveStep((current) => (current >= steps.length ? 0 : current + 1));
  }

  return (
    <section className="card mission-card agent-workflow">
      <div className="workflow-header">
        <div>
          <p className="eyebrow">{language === 'ru' ? 'Инженерный ИИ-агент' : language === 'kk' ? 'Инженерлік AI агенті' : 'AI Engineering Agent'}</p>
          <h2>{copy.title[stage]}</h2>
        </div>
        <button type="button" onClick={handleNext}>
          {activeStep === 0 ? copy.start : isComplete ? copy.restart : copy.next}
        </button>
      </div>
      <ol className="workflow-list">
        {steps.map((step, index) => (
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

function buildDomainSteps(steps: Array<{ title: string; result: string }>, stage: EngineeringStage, domain: VehicleDomain, language: Language) {
  if (domain === 'aviation') return steps;

  const resultByStage: Record<Language, Record<EngineeringStage, string[]>> = {
    kk: {
      design: ['Пайдалы жүк, орбита, күн панельдері және габарит қабылданды.', 'Жылу режимі, радиация қоры және ұшыру жүктемесі бағаланды.', 'Кубсат, төмен/күн-синхронды/геостационарлық орбита және орналастырылған жүк салыстырылды.'],
      manufacturing: ['ECSS-Q бойынша материал, дегазация және радиациялық тұрақтылық тексерілді.', 'DMLS, ЧПУ және ғарыштық композит процесі салыстырылды.', 'Вакуум, термоцикл және NDT бақылауы ұсынылды.'],
      operations: ['Орбита режимі, қуат балансы, байланыс және термоцикл қабылданды.', 'Цифрлық модель спутниктің орбиталық күйін қайталады.', 'Қуат қоры, байланыс тәуекелі және ресурс шектеуі анықталды.'],
    },
    ru: {
      design: ['Полезная нагрузка, орбита, солнечные панели и габариты приняты.', 'Оценены тепловой режим, радиационная стойкость и пусковые нагрузки.', 'Сравнены кубсат, разные орбиты и размещённая полезная нагрузка.'],
      manufacturing: ['Проверены материал, дегазация и радиационная стойкость по космическим требованиям.', 'Сравнены лазерное спекание металла, ЧПУ и космический композитный процесс.', 'Назначены вакуумный контроль, термоциклы и дефектоскопия.'],
      operations: ['Приняты орбитальный режим, энергобаланс, связь и термоциклирование.', 'Цифровой двойник повторяет орбитальное состояние спутника.', 'Определены запас энергии, риск связи и ресурсные ограничения.'],
    },
    en: {
      design: ['Payload, orbit, solar array, and size limits are accepted.', 'Thermal mode, radiation tolerance, and launch loads are estimated.', 'CubeSat, LEO/SSO/GEO, and hosted payload are compared.'],
      manufacturing: ['Material, outgassing, and radiation tolerance are checked against ECSS-Q.', 'DMLS, CNC, and space composite routes are compared.', 'Vacuum checks, thermal cycling, and NDT are assigned.'],
      operations: ['Orbit mode, power balance, link, and thermal cycling are accepted.', 'The Digital Twin mirrors the satellite orbital state.', 'Energy reserve, link risk, and service-life limits are defined.'],
    },
  };

  return steps.map((step, index) => ({
    ...step,
    result: resultByStage[language][stage][index],
  }));
}

import { useState } from 'react';
import { useLanguage, type Language } from '../lib/language';
import './DigitalTwinPanel.css';

type Step = {
  label: string;
  description: string;
  purpose: string;
};

const text: Record<Language, { title: string; body: string; purposeTitle: string; steps: Step[] }> = {
  kk: {
    title: 'Нақты аппараттан инженерлік шешімге',
    body: 'Виртуалды модель температураны, батареяны, массаны және ұшу режимін бақылайды, содан кейін алдын ала техникалық шешім ұсынады.',
    purposeTitle: 'Бұл не үшін керек',
    steps: [
      { label: 'Real UAV', description: 'Бұл нақты ұшатын аппарат: дрон, ұшақ немесе сынақ прототипі.', purpose: 'Нақты аппараттан бастапқы деректерді алу үшін керек.' },
      { label: 'Telemetry', description: 'Аппарат жіберетін деректер: батарея, температура, биіктік, жылдамдық және режим.', purpose: 'Жүйенің жағдайын нақты уақытта көру үшін керек.' },
      { label: 'Digital Twin', description: 'Компьютердегі виртуалды көшірме нақты аппараттың күйін қайталайды.', purpose: 'Қауіпсіз ортада аппаратты талдау және тестілеу үшін керек.' },
      { label: 'Prediction', description: 'AI келесі жағдайды болжайды: энергия жетпеуі, қызу немесе істен шығу қаупі.', purpose: 'Мәселені алдын ала байқау үшін керек.' },
      { label: 'Engineering Decision', description: 'Инженерге ұсыныс: жүктемені азайту, батареяны өзгерту немесе конструкцияны жақсарту.', purpose: 'Дұрыс техникалық шешім қабылдау үшін керек.' },
    ],
  },
  ru: {
    title: 'От реального аппарата к инженерному решению',
    body: 'Виртуальная модель отслеживает температуру, батарею, массу и режим полёта, а затем заранее предлагает техническое решение.',
    purposeTitle: 'Для чего это предназначено',
    steps: [
      { label: 'Real UAV', description: 'Это реальный летательный аппарат: дрон, самолёт или тестовый прототип.', purpose: 'Нужен как источник настоящих данных о работе аппарата.' },
      { label: 'Telemetry', description: 'Это поток данных от аппарата: батарея, температура, высота, скорость и режим полёта.', purpose: 'Нужна, чтобы видеть состояние системы в реальном времени.' },
      { label: 'Digital Twin', description: 'Это виртуальная копия аппарата в компьютере, которая повторяет его состояние.', purpose: 'Нужен, чтобы безопасно анализировать и тестировать аппарат без риска поломки.' },
      { label: 'Prediction', description: 'Это прогноз AI: что может случиться дальше с батареей, нагрузкой, температурой или энергией.', purpose: 'Нужен, чтобы заранее заметить проблему до отказа аппарата.' },
      { label: 'Engineering Decision', description: 'Это техническое решение для инженера: изменить массу, батарею, материал, скорость или конструкцию.', purpose: 'Нужно, чтобы выбрать более надёжный и эффективный вариант аппарата.' },
    ],
  },
  en: {
    title: 'From a real vehicle to an engineering decision',
    body: 'The virtual model tracks temperature, battery, mass, and flight mode, then suggests a technical decision in advance.',
    purposeTitle: 'What it is for',
    steps: [
      { label: 'Real UAV', description: 'The physical aircraft: a drone, airplane, or test prototype.', purpose: 'It provides real operational data.' },
      { label: 'Telemetry', description: 'Live data from the vehicle: battery, temperature, altitude, speed, and flight mode.', purpose: 'It helps monitor system health in real time.' },
      { label: 'Digital Twin', description: 'A virtual computer model that mirrors the real vehicle state.', purpose: 'It enables safe analysis and testing without damaging the real vehicle.' },
      { label: 'Prediction', description: 'An AI forecast of possible battery, load, temperature, or energy issues.', purpose: 'It helps detect problems before failure happens.' },
      { label: 'Engineering Decision', description: 'A technical recommendation: adjust mass, battery, material, speed, or structure.', purpose: 'It helps choose a more reliable and efficient design.' },
    ],
  },
};

export function DigitalTwinPanel() {
  const { language } = useLanguage();
  const copy = text[language];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedStep = copy.steps[selectedIndex];

  return (
    <section className="card twin-panel">
      <div>
        <p className="eyebrow">Digital Twin + AI Agent</p>
        <h2>{copy.title}</h2>
      </div>
      <div className="twin-diagram" aria-label="Digital twin process">
        {copy.steps.map((step, index) => (
          <button
            className={index === selectedIndex ? 'is-selected' : ''}
            key={step.label}
            onClick={() => setSelectedIndex(index)}
            type="button"
          >
            {step.label}
          </button>
        ))}
      </div>
      <p>{copy.body}</p>
      <article className="twin-explanation">
        <h3>{selectedStep.label}</h3>
        <p>{selectedStep.description}</p>
        <strong>{copy.purposeTitle}: {selectedStep.purpose}</strong>
      </article>
    </section>
  );
}

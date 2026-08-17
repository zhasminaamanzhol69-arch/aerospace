import { useState } from 'react';
import type { CalculatedParameters, MissionRequirements } from '../lib/aerospace';
import { useLanguage, type Language } from '../lib/language';
import './DigitalTwinPanel.css';

type Step = {
  label: string;
  description: string;
  purpose: string;
};

type Props = {
  parameters: CalculatedParameters;
  requirements: MissionRequirements;
};

const text: Record<Language, { title: string; body: string; purposeTitle: string; steps: Step[] }> = {
  kk: {
    title: 'Пайдалану және телеметрия',
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
    title: 'Эксплуатация и телеметрия цифрового двойника',
    body: 'Виртуальная модель отслеживает температуру, батарею, массу и режим полёта, а затем заранее предлагает техническое решение.',
    purposeTitle: 'Для чего это предназначено',
    steps: [
      { label: 'Реальный БПЛА', description: 'Это реальный летательный аппарат: дрон, самолёт или тестовый прототип.', purpose: 'Нужен как источник настоящих данных о работе аппарата.' },
      { label: 'Телеметрия', description: 'Это поток данных от аппарата: батарея, температура, высота, скорость и режим полёта.', purpose: 'Нужна, чтобы видеть состояние системы в реальном времени.' },
      { label: 'Цифровой двойник', description: 'Это виртуальная копия аппарата в компьютере, которая повторяет его состояние.', purpose: 'Нужен, чтобы безопасно анализировать и тестировать аппарат без риска поломки.' },
      { label: 'Прогноз', description: 'Это прогноз ИИ: что может случиться дальше с батареей, нагрузкой, температурой или энергией.', purpose: 'Нужен, чтобы заранее заметить проблему до отказа аппарата.' },
      { label: 'Инженерное решение', description: 'Это техническое решение для инженера: изменить массу, батарею, материал, скорость или конструкцию.', purpose: 'Нужно, чтобы выбрать более надёжный и эффективный вариант аппарата.' },
    ],
  },
  en: {
    title: 'Operations and Digital Twin Telemetry',
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

export function DigitalTwinPanel({ parameters, requirements }: Props) {
  const { language } = useLanguage();
  const copy = getDomainCopy(text[language], requirements.vehicleDomain, language);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedStep = copy.steps[selectedIndex];
  const isSpacecraft = requirements.vehicleDomain === 'spacecraft';
  const prediction = buildPrediction(parameters, isSpacecraft, language);
  const telemetry = isSpacecraft
    ? localizedSpaceTelemetry(requirements, language)
    : localizedAviationTelemetry(requirements, language);
  const twinState = localizedTwinState(parameters, requirements, isSpacecraft, language);

  return (
    <section className="card twin-panel">
      <div>
        <p className="eyebrow">{language === 'ru' ? 'Эксплуатация и телеметрия цифрового двойника' : 'Operations & Digital Twin Telemetry'}</p>
        <h2>{copy.title}</h2>
      </div>
      <div className="telemetry-chain" aria-label="Operations telemetry chain">
        <article>
          <strong>{language === 'ru' ? 'РЕАЛЬНЫЙ АППАРАТ' : 'REAL VEHICLE'}</strong>
          <span>{vehicleLabel(requirements, isSpacecraft, language)}</span>
        </article>
        <article>
          <strong>{language === 'ru' ? 'ТЕЛЕМЕТРИЯ 50 Гц' : 'TELEMETRY 50 Hz'}</strong>
          <span>{telemetry}</span>
        </article>
        <article>
          <strong>{language === 'ru' ? 'ЦИФРОВОЙ ДВОЙНИК' : 'DIGITAL TWIN'}</strong>
          <span>{twinState}</span>
        </article>
        <article>
          <strong>{language === 'ru' ? 'ПРОГНОЗ ИИ' : 'AI FORECAST'}</strong>
          <span>{prediction}</span>
        </article>
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

function buildPrediction(parameters: CalculatedParameters, isSpacecraft: boolean, language: Language) {
  if (parameters.anomalyStatus !== 'OK') {
    if (language === 'ru') return isSpacecraft ? 'Предупреждение: проверить питание, тепло и связь до следующего сеанса' : 'Предупреждение: проверить нагрев и связь перед следующим полётом';
    return isSpacecraft ? 'Warning: check power/thermal link before next pass' : 'Warning: check thermal/link before next flight';
  }

  if (language === 'ru') return isSpacecraft ? `Аномалий нет / обслуживание через ${parameters.serviceLifeHours} ч` : `Аномалий нет / обслуживание через ${parameters.serviceLifeHours} ч`;
  return isSpacecraft ? `No anomaly / orbit service in ${parameters.serviceLifeHours} h` : `Аномалий не обнаружено / service in ${parameters.serviceLifeHours} h`;
}

function localizedSpaceTelemetry(requirements: MissionRequirements, language: Language) {
  if (language === 'ru') return `Орбита ${requirements.orbitClass.toUpperCase()} / Солнце ${requirements.solarArrayW} Вт / Радиация ${requirements.radiationToleranceKrad} крад`;
  return `Orbit ${requirements.orbitClass.toUpperCase()} / Solar ${requirements.solarArrayW}W / Rad ${requirements.radiationToleranceKrad}krad`;
}

function localizedAviationTelemetry(requirements: MissionRequirements, language: Language) {
  if (language === 'ru') return `Температура ${requirements.motorTempC}°C / Аккумулятор ${requirements.batteryVoltageV} В / Вибрация ${requirements.vibrationG}g`;
  return `Temp ${requirements.motorTempC}°C / Batt ${requirements.batteryVoltageV}V / Vib ${requirements.vibrationG}g`;
}

function localizedTwinState(parameters: CalculatedParameters, requirements: MissionRequirements, isSpacecraft: boolean, language: Language) {
  if (language !== 'ru') {
    return isSpacecraft ? `Power ${parameters.requiredEnergyWh}Wh / Link ${parameters.linkQualityPercent}%` : `SoH ${requirements.batterySohPercent}% / Link ${parameters.linkQualityPercent}%`;
  }

  return isSpacecraft
    ? `Энергия ${parameters.requiredEnergyWh} Вт·ч / Связь ${parameters.linkQualityPercent}%`
    : `Состояние аккумулятора ${requirements.batterySohPercent}% / Связь ${parameters.linkQualityPercent}%`;
}

function vehicleLabel(requirements: MissionRequirements, isSpacecraft: boolean, language: Language) {
  if (language !== 'ru') return isSpacecraft ? 'CubeSat / Satellite' : requirements.vehicleScheme;
  if (isSpacecraft) return 'Кубсат / спутник';
  if (requirements.vehicleScheme === 'fixed-wing') return 'Самолётная схема';
  if (requirements.vehicleScheme === 'hybrid-vtol') return 'Гибридный вертикальный взлёт';
  if (requirements.vehicleScheme === 'multirotor') return 'Мультиротор';
  return requirements.vehicleScheme;
}

function getDomainCopy(copy: typeof text.ru, domain: MissionRequirements['vehicleDomain'], language: Language) {
  if (domain === 'aviation') return copy;

  const spacecraftSteps: Record<Language, Step[]> = {
    kk: [
      { label: 'Real Spacecraft', description: 'Бұл нақты CubeSat, спутник немесе ғарыштық пайдалы жүктеме.', purpose: 'Орбиталық аппараттан бастапқы телеметрияны алу үшін керек.' },
      { label: 'Telemetry', description: 'Аппарат жіберетін деректер: орбита, қуат балансы, байланыс, температура және радиациялық орта.', purpose: 'Ғарыштық жүйенің күйін нақты уақытта бағалау үшін керек.' },
      { label: 'Digital Twin', description: 'Виртуалды модель спутниктің орбиталық және жылулық күйін қайталайды.', purpose: 'Вакуум, термоцикл және қуат тәуекелдерін қауіпсіз талдау үшін керек.' },
      { label: 'Prediction', description: 'AI энергия тапшылығын, байланыс үзілуін немесе қызу қаупін болжайды.', purpose: 'Келесі байланыс сеансына дейін ақауды алдын ала көру үшін керек.' },
      { label: 'Engineering Decision', description: 'Инженерге ұсыныс: қуат режимін өзгерту, жүктемені шектеу немесе термоконтурды түзету.', purpose: 'Орбиталық миссияны қауіпсіз жалғастыру үшін керек.' },
    ],
    ru: [
      { label: 'Реальный космический аппарат', description: 'Это реальный кубсат, спутник или космическая полезная нагрузка.', purpose: 'Нужен как источник настоящей орбитальной телеметрии.' },
      { label: 'Телеметрия', description: 'Это поток данных: орбита, энергобаланс, связь, температура и радиационная среда.', purpose: 'Нужна, чтобы видеть состояние космической системы в реальном времени.' },
      { label: 'Цифровой двойник', description: 'Виртуальная модель повторяет орбитальное и тепловое состояние спутника.', purpose: 'Нужен, чтобы безопасно анализировать вакуум, термоциклы и энергетические риски.' },
      { label: 'Прогноз', description: 'ИИ прогнозирует нехватку энергии, потерю связи или риск перегрева.', purpose: 'Нужен, чтобы заметить проблему до следующего сеанса связи.' },
      { label: 'Инженерное решение', description: 'Рекомендация инженеру: изменить режим питания, ограничить нагрузку или скорректировать термоконтур.', purpose: 'Нужна, чтобы безопасно продолжать орбитальную миссию.' },
    ],
    en: [
      { label: 'Real Spacecraft', description: 'The physical CubeSat, satellite, or space payload.', purpose: 'It provides real orbital telemetry.' },
      { label: 'Telemetry', description: 'Live data: orbit, power balance, link, temperature, and radiation environment.', purpose: 'It monitors spacecraft health in real time.' },
      { label: 'Digital Twin', description: 'A virtual model that mirrors orbital and thermal spacecraft state.', purpose: 'It safely analyzes vacuum, thermal cycling, and power risks.' },
      { label: 'Prediction', description: 'AI forecasts energy shortage, link loss, or overheating risk.', purpose: 'It detects issues before the next communication pass.' },
      { label: 'Engineering Decision', description: 'A recommendation to adjust power mode, limit payload, or tune thermal control.', purpose: 'It keeps the orbital mission within safe limits.' },
    ],
  };

  return {
    ...copy,
    body: {
      kk: 'Виртуалды модель орбитаны, қуат балансын, байланысты және жылу режимін бақылайды, содан кейін спутникке техникалық шешім ұсынады.',
      ru: 'Виртуальная модель отслеживает орбиту, энергобаланс, связь и тепловой режим, затем предлагает техническое решение для спутника.',
      en: 'The virtual model tracks orbit, power balance, link status, and thermal mode, then suggests a spacecraft engineering decision.',
    }[language],
    steps: spacecraftSteps[language],
  };
}

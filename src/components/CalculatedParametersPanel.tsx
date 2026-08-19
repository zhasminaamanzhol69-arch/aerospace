import type { CalculatedParameters, MissionRequirements } from '../lib/aerospace';
import type { EngineeringStage } from '../lib/engineeringStage';
import { useLanguage, type Language } from '../lib/language';
import './CalculatedParametersPanel.css';

type Props = {
  stage: EngineeringStage;
  parameters: CalculatedParameters;
  requirements: MissionRequirements;
};

type Metric = { label: string; value: string };

const text: Record<Language, {
  eyebrow: string;
  titles: Record<EngineeringStage, string>;
  risk: Record<string, string>;
}> = {
  kk: {
    eyebrow: 'Есептелген параметрлер',
    titles: { design: 'Жобалау талдауы', manufacturing: 'Өндіріс пен материалдарды талдау', operations: 'Пайдалану талдауы' },
    risk: { Low: 'Төмен', Medium: 'Орташа', High: 'Жоғары' },
  },
  ru: {
    eyebrow: 'Расчётные параметры',
    titles: { design: 'Анализ проектирования', manufacturing: 'Анализ производства и материалов', operations: 'Анализ эксплуатации' },
    risk: { Low: 'Низкий', Medium: 'Средний', High: 'Высокий' },
  },
  en: {
    eyebrow: 'Calculated Parameters',
    titles: { design: 'Design analysis', manufacturing: 'Manufacturing and materials analysis', operations: 'Operations analysis' },
    risk: { Low: 'Low', Medium: 'Medium', High: 'High' },
  },
};

export function CalculatedParametersPanel({ stage, parameters, requirements }: Props) {
  const { language } = useLanguage();
  const copy = text[language];
  const metrics = buildStageMetrics(stage, parameters, requirements, copy.risk, language);

  return (
    <section className="card calculated-panel">
      <div>
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2>{copy.titles[stage]}</h2>
      </div>
      <div className={`calculated-grid calculated-grid--${stage}`}>
        {metrics.map((metric) => (
          <article className="calculated-metric" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function buildStageMetrics(
  stage: EngineeringStage,
  parameters: CalculatedParameters,
  requirements: MissionRequirements,
  risk: Record<string, string>,
  language: Language,
): Metric[] {
  if (stage === 'design') return buildDesignMetrics(parameters, requirements, risk, language);

  if (stage === 'manufacturing') {
    if (language === 'kk') {
      return [
        { label: 'Өндіріс күрделілігі', value: `${complexityName(parameters.manufacturingComplexityPercent, language)} / ${parameters.manufacturingComplexityPercent}%` },
        { label: 'Дәлдік / ISO 2768-m рұқсаты', value: `±${parameters.manufacturingToleranceMm} мм` },
        { label: 'Дайындау уақыты', value: `${parameters.leadTimeHours} сағ / бөлшек` },
        { label: 'Дефектоскопия', value: ndtName(parameters.ndtMethod, language) },
        { label: 'Материал бағыты', value: materialName(requirements.material, language) },
        { label: 'Процесс тәуекелі', value: risk[parameters.riskLevel] },
      ];
    }

    if (language === 'ru') {
      return [
        { label: 'Сложность производства', value: `${complexityName(parameters.manufacturingComplexityPercent, language)} / ${parameters.manufacturingComplexityPercent}%` },
        { label: 'Точность / допуск ISO 2768-m', value: `±${parameters.manufacturingToleranceMm} мм` },
        { label: 'Срок изготовления', value: `${parameters.leadTimeHours} ч / деталь` },
        { label: 'Дефектоскопия', value: ndtName(parameters.ndtMethod, language) },
        { label: 'Маршрут материала', value: materialName(requirements.material, language) },
        { label: 'Производственный риск', value: risk[parameters.riskLevel] },
      ];
    }

    return [
      { label: 'Manufacturing Complexity', value: `${complexityName(parameters.manufacturingComplexityPercent, language)} / ${parameters.manufacturingComplexityPercent}%` },
      { label: 'Precision / Tolerance ISO 2768-m', value: `±${parameters.manufacturingToleranceMm} mm` },
      { label: 'Lead Time', value: `${parameters.leadTimeHours} h / part` },
      { label: 'NDT', value: ndtName(parameters.ndtMethod, language) },
      { label: 'Material route', value: materialName(requirements.material, language) },
      { label: 'Process risk', value: risk[parameters.riskLevel] },
    ];
  }

  if (stage === 'operations') {
    if (requirements.vehicleDomain === 'spacecraft') {
      if (language === 'ru') {
        return [
          { label: 'Энергобаланс', value: `Солнечные панели ${requirements.solarArrayW} Вт / нагрузка ${requirements.payloadPowerW} Вт` },
          { label: 'Терморежим в вакууме', value: `${thermalName(requirements.thermalControl)} / бортовой компьютер ${parameters.onboardComputerTempC}°C` },
          { label: 'Орбита и качество связи', value: `${orbitName(requirements.orbitClass)} / ${parameters.linkQualityPercent}%` },
          { label: 'Запас по радиации', value: `${requirements.radiationToleranceKrad} крад / задержка ${requirements.telemetryLatencyMs} мс` },
          { label: 'Остаточный ресурс', value: `${parameters.serviceLifeHours} орбитальных ч` },
          { label: 'Статус аномалий', value: `${statusName(parameters.anomalyStatus, language)} / ${risk[parameters.riskLevel]}` },
        ];
      }

      if (language === 'kk') {
        return [
          { label: 'Энергия теңгерімі', value: `күн панелі ${requirements.solarArrayW} Вт / жүктеме ${requirements.payloadPowerW} Вт` },
          { label: 'Вакуумдағы жылу режимі', value: `${thermalName(requirements.thermalControl, language)} / борттық компьютер ${parameters.onboardComputerTempC}°C` },
          { label: 'Орбита және байланыс сапасы', value: `${orbitName(requirements.orbitClass, language)} / ${parameters.linkQualityPercent}%` },
          { label: 'Радиация қоры', value: `${requirements.radiationToleranceKrad} крад / кідіріс ${requirements.telemetryLatencyMs} мс` },
          { label: 'Қалған ресурс', value: `${parameters.serviceLifeHours} орбиталық сағ` },
          { label: 'Ақау статусы', value: `${statusName(parameters.anomalyStatus, language)} / ${risk[parameters.riskLevel]}` },
        ];
      }

      return [
        { label: 'Power Balance', value: `Solar ${requirements.solarArrayW} W / load ${requirements.payloadPowerW} W` },
        { label: 'Thermal Vacuum Mode', value: `${requirements.thermalControl} / OBC ${parameters.onboardComputerTempC}°C` },
        { label: 'Orbit & Link Quality', value: `${requirements.orbitClass.toUpperCase()} / ${parameters.linkQualityPercent}%` },
        { label: 'Radiation Margin', value: `${requirements.radiationToleranceKrad} krad / latency ${requirements.telemetryLatencyMs} ms` },
        { label: 'Service Life', value: `${parameters.serviceLifeHours} orbital h` },
        { label: 'Anomaly Status', value: `${parameters.anomalyStatus} / ${risk[parameters.riskLevel]}` },
      ];
    }

    return [
      { label: operationLabel('battery', language), value: operationValue('battery', requirements, parameters, language) },
      { label: operationLabel('thermal', language), value: operationValue('thermal', requirements, parameters, language) },
      { label: operationLabel('link', language), value: `${parameters.linkQualityPercent}% / GPS ${requirements.satelliteCount}` },
      { label: operationLabel('latency', language), value: operationValue('latency', requirements, parameters, language) },
      { label: operationLabel('life', language), value: operationValue('life', requirements, parameters, language) },
      { label: operationLabel('status', language), value: `${statusName(parameters.anomalyStatus, language)} / ${risk[parameters.riskLevel]}` },
    ];
  }

  return [];
}

function buildDesignMetrics(
  parameters: CalculatedParameters,
  requirements: MissionRequirements,
  risk: Record<string, string>,
  language: Language,
) {
  if (requirements.vehicleDomain === 'spacecraft') {
    if (language === 'kk') {
      return [
        { label: 'Орбита класы', value: orbitName(requirements.orbitClass, language) },
        { label: 'Пайдалы жүк қуаты', value: `${requirements.payloadPowerW} Вт` },
        { label: 'Күн панельдері', value: `${requirements.solarArrayW} Вт` },
        { label: 'Термореттеу', value: thermalName(requirements.thermalControl, language) },
        { label: 'Радиацияға төзімділік', value: `${requirements.radiationToleranceKrad} крад` },
        { label: 'Энергия қоры', value: `${parameters.requiredEnergyWh} Вт·сағ` },
        { label: 'Іске қосу жүктемесі қоры', value: `${parameters.marginOfSafety} / ${parameters.loadFactorG}g` },
        { label: 'Миссия тәуекелі', value: risk[parameters.riskLevel] },
      ];
    }

    if (language === 'ru') {
      return [
        { label: 'Класс орбиты', value: orbitName(requirements.orbitClass, language) },
        { label: 'Мощность полезной нагрузки', value: `${requirements.payloadPowerW} Вт` },
        { label: 'Солнечные панели', value: `${requirements.solarArrayW} Вт` },
        { label: 'Терморегулирование', value: thermalName(requirements.thermalControl, language) },
        { label: 'Радиационная стойкость', value: `${requirements.radiationToleranceKrad} крад` },
        { label: 'Запас энергии', value: `${parameters.requiredEnergyWh} Вт·ч` },
        { label: 'Запас по пусковой нагрузке', value: `${parameters.marginOfSafety} / ${parameters.loadFactorG}g` },
        { label: 'Риск миссии', value: risk[parameters.riskLevel] },
      ];
    }

    return [
      { label: 'Orbit class', value: requirements.orbitClass.toUpperCase() },
      { label: 'Payload power', value: `${requirements.payloadPowerW} W` },
      { label: 'Solar array', value: `${requirements.solarArrayW} W` },
      { label: 'Thermal control', value: requirements.thermalControl },
      { label: 'Radiation tolerance', value: `${requirements.radiationToleranceKrad} krad` },
      { label: 'Energy reserve', value: `${parameters.requiredEnergyWh} Wh` },
      { label: 'Launch load MOS', value: `${parameters.marginOfSafety} / ${parameters.loadFactorG}g` },
      { label: 'Mission risk', value: risk[parameters.riskLevel] },
    ];
  }

  const labels = {
    ru: ['Расчётная взлётная масса', 'Средняя мощность', 'Пиковая мощность', 'Ёмкость батарей', 'Площадь крыла', 'Размах крыла', 'Аэродинамическое качество', 'Нагрузка, Н/м²', 'Запас прочности'],
    kk: ['Есептік ұшу массасы', 'Орташа қуат', 'Пик қуат', 'Батарея сыйымдылығы', 'Қанат ауданы', 'Қанат құлашы', 'Аэродинамикалық сапа', 'Жүктеме, Н/м²', 'Беріктік қоры'],
    en: ['Estimated MTOW', 'Average power', 'Peak power', 'Battery capacity', 'Wing area S', 'Wing span b', 'L/D', 'Loading N/m²', 'Margin of Safety'],
  }[language];

  return [
    { label: labels[0], value: language !== 'en' ? `${parameters.estimatedTakeoffMassKg} кг` : `${parameters.estimatedTakeoffMassKg} kg` },
    { label: labels[1], value: language !== 'en' ? `${parameters.averagePowerW} Вт` : `${parameters.averagePowerW} W` },
    { label: labels[2], value: language !== 'en' ? `${parameters.peakPowerW} Вт` : `${parameters.peakPowerW} W` },
    { label: labels[3], value: language !== 'en' ? `${parameters.requiredEnergyWh} Вт·ч` : `${parameters.requiredEnergyWh} Wh` },
    { label: labels[4], value: `${parameters.wingAreaM2} m²` },
    { label: labels[5], value: `${parameters.wingSpanM} m` },
    { label: labels[6], value: `${parameters.liftToDrag}` },
    { label: labels[7], value: language !== 'en' ? `${parameters.wingOrDiskLoading} Н/м²` : `${parameters.wingOrDiskLoading} N/m²` },
    { label: labels[8], value: language !== 'en' ? `${parameters.marginOfSafety} / ${parameters.loadFactorG}g · ${risk[parameters.riskLevel]}` : `${parameters.marginOfSafety} / ny=${parameters.loadFactorG}g (${risk[parameters.riskLevel]})` },
  ];
}

function materialName(material: string, language: Language) {
  if (language === 'kk') {
    if (material === 'aluminum-2024') return 'Алюминий-литий 2024';
    if (material === 'aluminum-7075') return 'Алюминий 7075-Т6';
    if (material === 'dmls-metal') return 'лазерлік балқыту металы';
    if (material === 'carbon') return 'көмірпластик';
    if (material === 'titanium') return 'титан';
  }
  if (language === 'ru') {
    if (material === 'aluminum-2024') return 'Алюминий-литиевый сплав 2024';
    if (material === 'aluminum-7075') return 'Алюминий 7075-Т6';
    if (material === 'dmls-metal') return 'металл для лазерного спекания';
    if (material === 'carbon') return 'углепластик';
    if (material === 'titanium') return 'титан';
  }
  if (material === 'aluminum-2024') return 'Al 2024';
  if (material === 'aluminum-7075') return 'Al 7075';
  if (material === 'dmls-metal') return 'DMLS metal';
  if (material === 'carbon') return 'CFRP';
  if (material === 'titanium') return 'Ti';
  return material;
}

function complexityName(value: number, language: Language) {
  if (language === 'kk') {
    if (value >= 78) return 'Жоғары';
    if (value >= 55) return 'Орташа';
    return 'Төмен';
  }
  if (language === 'ru') {
    if (value >= 78) return 'Высокая';
    if (value >= 55) return 'Средняя';
    return 'Низкая';
  }
  if (value >= 78) return 'High';
  if (value >= 55) return 'Medium';
  return 'Low';
}

function ndtName(value: string, language: Language) {
  if (value === 'Ultrasound C-Scan') {
    if (language === 'kk') return 'ультрадыбыстық C-Scan';
    if (language === 'ru') return 'ультразвуковой C-Scan';
  }
  return value;
}

function thermalName(value: string, language: Language = 'ru') {
  if (value === 'passive') return language === 'kk' ? 'пассивті термореттеу' : 'пассивное терморегулирование';
  if (value === 'active') return language === 'kk' ? 'активті термореттеу' : 'активное терморегулирование';
  return value;
}

function orbitName(value: string, language: Language = 'ru') {
  if (value === 'leo') return language === 'kk' ? 'төмен Жер орбитасы' : 'низкая околоземная орбита';
  if (value === 'sso') return language === 'kk' ? 'күн-синхронды орбита' : 'солнечно-синхронная орбита';
  if (value === 'geo') return language === 'kk' ? 'геостационарлық орбита' : 'геостационарная орбита';
  return value;
}

function statusName(value: string, language: Language) {
  if (language === 'kk') {
    if (value === 'OK') return 'норма';
    if (value === 'Warning') return 'ескерту';
    return value;
  }
  if (language !== 'ru') return value;
  if (value === 'OK') return 'норма';
  if (value === 'Warning') return 'предупреждение';
  return value;
}

function operationLabel(key: string, language: Language) {
  const labels = {
    kk: { battery: 'Аккумулятор күйі және резерв', thermal: 'Жылу режимі', link: 'Байланыс сапасы', latency: 'Телеметрия кідірісі', life: 'Қалған ресурс', status: 'Ақау статусы' },
    ru: { battery: 'Состояние аккумулятора и резерв', thermal: 'Тепловой режим', link: 'Качество связи', latency: 'Задержка телеметрии', life: 'Остаточный ресурс', status: 'Статус аномалий' },
    en: { battery: 'Battery Health & Reserve', thermal: 'Thermal mode', link: 'Link Quality', latency: 'Telemetry latency', life: 'MTBF / Service Life', status: 'Anomaly Status' },
  }[language];
  return labels[key as keyof typeof labels];
}

function operationValue(key: string, requirements: MissionRequirements, parameters: CalculatedParameters, language: Language) {
  if (key === 'battery') {
    if (language === 'kk') return `${requirements.batterySohPercent}% / авариялық қайту ${parameters.emergencyReservePercent}%`;
    if (language === 'ru') return `${requirements.batterySohPercent}% / аварийный возврат ${parameters.emergencyReservePercent}%`;
    return `SoH ${requirements.batterySohPercent}% / RTH ${parameters.emergencyReservePercent}%`;
  }
  if (key === 'thermal') {
    if (language === 'kk') return `қозғалтқыш ${requirements.motorTempC}°C / борттық компьютер ${parameters.onboardComputerTempC}°C`;
    if (language === 'ru') return `двигатель ${requirements.motorTempC}°C / бортовой компьютер ${parameters.onboardComputerTempC}°C`;
    return `Motor ${requirements.motorTempC}°C / OBC ${parameters.onboardComputerTempC}°C`;
  }
  if (key === 'latency') {
    if (language === 'kk') return `${requirements.telemetryLatencyMs} мс / сигнал ${requirements.linkRssiDbm} dBm`;
    if (language === 'ru') return `${requirements.telemetryLatencyMs} мс / сигнал ${requirements.linkRssiDbm} dBm`;
    return `${requirements.telemetryLatencyMs} ms / RSSI ${requirements.linkRssiDbm} dBm`;
  }
  if (key === 'life') {
    if (language === 'kk') return `${parameters.serviceLifeHours} ұшу сағ`;
    if (language === 'ru') return `${parameters.serviceLifeHours} лётных ч`;
    return `${parameters.serviceLifeHours} flight h`;
  }
  return '';
}

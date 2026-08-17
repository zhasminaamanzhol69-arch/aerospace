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
    titles: { design: 'Design analysis', manufacturing: 'MANUFACTURING & MATERIALS ANALYSIS / ДАЙЫНДАУ ЖӘНЕ МАТЕРИАЛДАР', operations: 'Operations analysis' },
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
    if (language === 'ru') {
      return [
        { label: 'Сложность производства', value: `${complexityName(parameters.manufacturingComplexityPercent, language)} / ${parameters.manufacturingComplexityPercent}%` },
        { label: 'Точность / допуск ISO 2768-m', value: `±${parameters.manufacturingToleranceMm} мм` },
        { label: 'Срок изготовления', value: `${parameters.leadTimeHours} ч / деталь` },
        { label: 'Дефектоскопия', value: parameters.ndtMethod },
        { label: 'Маршрут материала', value: materialName(requirements.material, language) },
        { label: 'Производственный риск', value: risk[parameters.riskLevel] },
      ];
    }

    return [
      { label: 'Manufacturing Complexity', value: `${complexityName(parameters.manufacturingComplexityPercent, language)} / ${parameters.manufacturingComplexityPercent}%` },
      { label: 'Precision / Tolerance ISO 2768-m', value: `±${parameters.manufacturingToleranceMm} mm` },
      { label: 'Lead Time', value: `${parameters.leadTimeHours} h / part` },
      { label: 'NDT / Дефектоскопия', value: parameters.ndtMethod },
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
      { label: language === 'ru' ? 'Состояние аккумулятора и резерв' : 'Battery Health & Reserve', value: language === 'ru' ? `${requirements.batterySohPercent}% / аварийный возврат ${parameters.emergencyReservePercent}%` : `SoH ${requirements.batterySohPercent}% / RTH ${parameters.emergencyReservePercent}%` },
      { label: language === 'ru' ? 'Тепловой режим' : 'Thermal mode', value: language === 'ru' ? `двигатель ${requirements.motorTempC}°C / бортовой компьютер ${parameters.onboardComputerTempC}°C` : `Motor ${requirements.motorTempC}°C / OBC ${parameters.onboardComputerTempC}°C` },
      { label: language === 'ru' ? 'Качество связи' : 'Link Quality', value: `${parameters.linkQualityPercent}% / GPS ${requirements.satelliteCount}` },
      { label: language === 'ru' ? 'Задержка телеметрии' : 'Telemetry latency', value: language === 'ru' ? `${requirements.telemetryLatencyMs} мс / сигнал ${requirements.linkRssiDbm} dBm` : `${requirements.telemetryLatencyMs} ms / RSSI ${requirements.linkRssiDbm} dBm` },
      { label: language === 'ru' ? 'Остаточный ресурс' : 'MTBF / Service Life', value: language === 'ru' ? `${parameters.serviceLifeHours} лётных ч` : `${parameters.serviceLifeHours} flight h` },
      { label: language === 'ru' ? 'Статус аномалий' : 'Anomaly Status', value: `${statusName(parameters.anomalyStatus, language)} / ${risk[parameters.riskLevel]}` },
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
    if (language === 'ru') {
      return [
        { label: 'Класс орбиты', value: orbitName(requirements.orbitClass) },
        { label: 'Мощность полезной нагрузки', value: `${requirements.payloadPowerW} Вт` },
        { label: 'Солнечные панели', value: `${requirements.solarArrayW} Вт` },
        { label: 'Терморегулирование', value: thermalName(requirements.thermalControl) },
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
    kk: ['Есептік MTOW', 'Орташа қуат', 'Пик қуат', 'Батарея сыйымдылығы', 'Қанат ауданы S', 'Қанат құлашы b', 'L/D', 'Жүктеме N/m²', 'Беріктік қоры'],
    en: ['Estimated MTOW', 'Average power', 'Peak power', 'Battery capacity', 'Wing area S', 'Wing span b', 'L/D', 'Loading N/m²', 'Margin of Safety'],
  }[language];

  return [
    { label: labels[0], value: language === 'ru' ? `${parameters.estimatedTakeoffMassKg} кг` : `${parameters.estimatedTakeoffMassKg} kg` },
    { label: labels[1], value: language === 'ru' ? `${parameters.averagePowerW} Вт` : `${parameters.averagePowerW} W` },
    { label: labels[2], value: language === 'ru' ? `${parameters.peakPowerW} Вт` : `${parameters.peakPowerW} W` },
    { label: labels[3], value: language === 'ru' ? `${parameters.requiredEnergyWh} Вт·ч` : `${parameters.requiredEnergyWh} Wh` },
    { label: labels[4], value: `${parameters.wingAreaM2} m²` },
    { label: labels[5], value: `${parameters.wingSpanM} m` },
    { label: labels[6], value: `${parameters.liftToDrag}` },
    { label: labels[7], value: language === 'ru' ? `${parameters.wingOrDiskLoading} Н/м²` : `${parameters.wingOrDiskLoading} N/m²` },
    { label: labels[8], value: language === 'ru' ? `${parameters.marginOfSafety} / ${parameters.loadFactorG}g · ${risk[parameters.riskLevel]}` : `${parameters.marginOfSafety} / ny=${parameters.loadFactorG}g (${risk[parameters.riskLevel]})` },
  ];
}

function materialName(material: string, language: Language) {
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
  if (language === 'ru') {
    if (value >= 78) return 'Высокая';
    if (value >= 55) return 'Средняя';
    return 'Низкая';
  }
  if (value >= 78) return 'High';
  if (value >= 55) return 'Medium';
  return 'Low';
}

function thermalName(value: string) {
  if (value === 'passive') return 'пассивное терморегулирование';
  if (value === 'active') return 'активное терморегулирование';
  return value;
}

function orbitName(value: string) {
  if (value === 'leo') return 'низкая околоземная орбита';
  if (value === 'sso') return 'солнечно-синхронная орбита';
  if (value === 'geo') return 'геостационарная орбита';
  return value;
}

function statusName(value: string, language: Language) {
  if (language !== 'ru') return value;
  if (value === 'OK') return 'норма';
  if (value === 'Warning') return 'предупреждение';
  return value;
}

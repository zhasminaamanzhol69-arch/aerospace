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
  titles: Record<EngineeringStage, string>;
  risk: Record<string, string>;
}> = {
  kk: {
    titles: { design: 'Жобалау талдауы', manufacturing: 'MANUFACTURING & MATERIALS ANALYSIS / ДАЙЫНДАУ ЖӘНЕ МАТЕРИАЛДАР', operations: 'Пайдалану талдауы' },
    risk: { Low: 'Төмен', Medium: 'Орташа', High: 'Жоғары' },
  },
  ru: {
    titles: { design: 'Анализ проектирования', manufacturing: 'MANUFACTURING & MATERIALS ANALYSIS / ДАЙЫНДАУ ЖӘНЕ МАТЕРИАЛДАР', operations: 'Анализ эксплуатации' },
    risk: { Low: 'Низкий', Medium: 'Средний', High: 'Высокий' },
  },
  en: {
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
        <p className="eyebrow">Calculated Parameters</p>
        <h2>{copy.titles[stage]}</h2>
      </div>
      <div className="calculated-grid">
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
    return [
      { label: 'Manufacturing Complexity', value: `${complexityName(parameters.manufacturingComplexityPercent)} / ${parameters.manufacturingComplexityPercent}%` },
      { label: 'Precision / Tolerance ISO 2768-m', value: `±${parameters.manufacturingToleranceMm} mm` },
      { label: 'Lead Time', value: `${parameters.leadTimeHours} h / part` },
      { label: 'NDT / Дефектоскопия', value: parameters.ndtMethod },
      { label: 'Material route', value: materialName(requirements.material) },
      { label: 'Process risk', value: risk[parameters.riskLevel] },
    ];
  }

  if (stage === 'operations') {
    if (requirements.vehicleDomain === 'spacecraft') {
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
      { label: 'Battery Health & Reserve', value: `SoH ${requirements.batterySohPercent}% / RTH ${parameters.emergencyReservePercent}%` },
      { label: 'Thermal mode', value: `Motor ${requirements.motorTempC}°C / OBC ${parameters.onboardComputerTempC}°C` },
      { label: 'Link Quality', value: `${parameters.linkQualityPercent}% / GPS ${requirements.satelliteCount}` },
      { label: 'Telemetry latency', value: `${requirements.telemetryLatencyMs} ms / RSSI ${requirements.linkRssiDbm} dBm` },
      { label: 'MTBF / Service Life', value: `${parameters.serviceLifeHours} flight h` },
      { label: 'Anomaly Status', value: `${parameters.anomalyStatus} / ${risk[parameters.riskLevel]}` },
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
    ru: ['Расчётная MTOW', 'Средняя мощность', 'Пиковая мощность', 'Ёмкость батарей', 'Площадь крыла S', 'Размах крыла b', 'L/D', 'Нагрузка N/m²', 'Margin of Safety'],
    kk: ['Есептік MTOW', 'Орташа қуат', 'Пик қуат', 'Батарея сыйымдылығы', 'Қанат ауданы S', 'Қанат құлашы b', 'L/D', 'Жүктеме N/m²', 'Беріктік қоры'],
    en: ['Estimated MTOW', 'Average power', 'Peak power', 'Battery capacity', 'Wing area S', 'Wing span b', 'L/D', 'Loading N/m²', 'Margin of Safety'],
  }[language];

  return [
    { label: labels[0], value: `${parameters.estimatedTakeoffMassKg} kg` },
    { label: labels[1], value: `${parameters.averagePowerW} W` },
    { label: labels[2], value: `${parameters.peakPowerW} W` },
    { label: labels[3], value: `${parameters.requiredEnergyWh} Wh` },
    { label: labels[4], value: `${parameters.wingAreaM2} m²` },
    { label: labels[5], value: `${parameters.wingSpanM} m` },
    { label: labels[6], value: `${parameters.liftToDrag}` },
    { label: labels[7], value: `${parameters.wingOrDiskLoading} N/m²` },
    { label: labels[8], value: `${parameters.marginOfSafety} / ny=${parameters.loadFactorG}g (${risk[parameters.riskLevel]})` },
  ];
}

function materialName(material: string) {
  if (material === 'aluminum-2024') return 'Al 2024';
  if (material === 'aluminum-7075') return 'Al 7075';
  if (material === 'dmls-metal') return 'DMLS metal';
  if (material === 'carbon') return 'CFRP';
  if (material === 'titanium') return 'Ti';
  return material;
}

function complexityName(value: number) {
  if (value >= 78) return 'High';
  if (value >= 55) return 'Medium';
  return 'Low';
}

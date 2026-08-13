import type { CalculatedParameters, DesignOption, MissionRequirements } from './aerospace';
import {
  engineeringStageFocus,
  engineeringStageLabel,
  type EngineeringStage,
} from './engineeringStage';
import { aiReportFormat } from './aiReportFormat';
import type { Language } from './language';

const languageName: Record<Language, string> = {
  kk: 'казахский',
  ru: 'русский',
  en: 'английский',
};

export function buildEngineeringPrompt(
  requirements: MissionRequirements,
  parameters: CalculatedParameters,
  options: DesignOption[],
  language: Language,
  stage: EngineeringStage,
  userQuestion: string,
) {
  return [
    `Задача пользователя: ${userQuestion}`,
    `Язык ответа: ${languageName[language]}.`,
    `Выбранный фильтр поиска: ${engineeringStageLabel[stage]}.`,
    `Фокус нормативного поиска: ${engineeringStageFocus[stage]}.`,
    `Класс аппарата: ${requirements.vehicleDomain === 'spacecraft' ? 'Космонавтика / Спутники (Spacecraft & Payload)' : 'Авиация / БПЛА (Atmospheric Flight)'}.`,
    buildRequirementsBlock(requirements),
    buildParametersBlock(parameters),
    buildOptionsBlock(options),
    aiReportFormat,
    buildGuardrails(stage, requirements.vehicleDomain),
  ].join('\n\n').trim();
}

function buildRequirementsBlock(req: MissionRequirements) {
  return `Требования:
- payload: ${req.payloadKg} kg / ${req.payloadPowerW} W
- схема: ${req.vehicleScheme}, MTOW limit: ${req.takeoffMassKg} kg, size limit: ${req.maxDimensionM} m
- mission: range ${req.rangeKm} km, endurance ${req.enduranceHours} h, altitude/orbit ${req.altitudeKm} km
- orbit: ${req.orbitClass}, thermal control: ${req.thermalControl}, solar array: ${req.solarArrayW} W, radiation: ${req.radiationToleranceKrad} krad
- material/process: ${req.material}, ${req.manufacturingMethod}, joint ${req.jointMethod}, scale ${req.productionScale}, volume ${req.productionVolume}
- operations: ${req.environment}, ${req.missionMode}, check ${req.checkType}
- telemetry: SoH ${req.batterySohPercent}%, motor ${req.motorTempC}°C, hours ${req.flightHours}, RSSI ${req.linkRssiDbm} dBm, satellites ${req.satelliteCount}, latency ${req.telemetryLatencyMs} ms`;
}

function buildParametersBlock(params: CalculatedParameters) {
  return `Рассчитанные параметры:
- MTOW ${params.estimatedTakeoffMassKg} kg, average/peak power ${params.averagePowerW}/${params.peakPowerW} W, energy ${params.requiredEnergyWh} Wh
- geometry/aero: S ${params.wingAreaM2} m², b ${params.wingSpanM} m, L/D ${params.liftToDrag}, loading ${params.wingOrDiskLoading} N/m²
- strength: MOS ${params.marginOfSafety}, ny ${params.loadFactorG}g
- manufacturing: complexity ${params.manufacturingComplexityPercent}%, tolerance ±${params.manufacturingToleranceMm} mm, lead time ${params.leadTimeHours} h, NDT ${params.ndtMethod}
- operations: RTH reserve ${params.emergencyReservePercent}%, link ${params.linkQualityPercent}%, service ${params.serviceLifeHours} h, anomaly ${params.anomalyStatus}`;
}

function buildOptionsBlock(options: DesignOption[]) {
  const lines = options
    .map((option) => `- ${option.name}: score ${option.score}%, mass ${option.massKg} kg, power ${option.powerW} W, risk ${option.risk}`)
    .join('\n');

  return `Рассчитанные варианты:\n${lines}\n\nЛучший вариант по локальному расчёту: ${options[0].name}.`;
}

function buildGuardrails(stage: EngineeringStage, domain: MissionRequirements['vehicleDomain']) {
  return `Дополнительные правила:
- Раскрывай только выбранный этап ${engineeringStageLabel[stage]}; другие этапы не добавляй, если пользователь прямо не попросил сравнение.
- Не придумывай нормативные ссылки, коэффициенты, допустимые напряжения, допуски и параметры испытаний.
- Для Manufacturing используй ECSS-Q-ST-70C, ISO 9001/AS9100, ГОСТ 18353, ISO 2768-m, ISO 5817, ГОСТ 14771 только когда они релевантны.
- Для Operations используй ECSS-E-ST-10-03C, FAA Part 107, ИКАО, ГОСТ В 20.39.304, ГОСТ 23743 только когда они релевантны.
- ${domain === 'spacecraft' ? 'Для Spacecraft приоритизируй ECSS и NASA Technical Standards; FAA Part 107 не делай основным нормативом.' : 'Для Atmospheric Flight можно использовать FAA Part 107/ИКАО, если вопрос про БПЛА и эксплуатацию.'}`;
}

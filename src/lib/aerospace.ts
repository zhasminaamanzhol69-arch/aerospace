import {
  getAnomalyStatus,
  getEnergyAdvice,
  getEnvironmentFactor,
  getLeadTimeHours,
  getLinkQuality,
  getManufacturingComplexity,
  getManufacturingTolerance,
  getMaterialAdvice,
  getMaterialMassFactor,
  getNdtMethod,
  getOperationAdvice,
  getRiskLevel,
  round,
  scoreOption,
} from './aerospaceRules';
export type { CalculatedParameters, DesignOption, MissionRequirements } from './aerospaceTypes';
export { defaultRequirements } from './aerospaceTypes';
import type { CalculatedParameters, DesignOption, MissionRequirements } from './aerospaceTypes';

export function buildDesignOptions(req: MissionRequirements): DesignOption[] {
  const params = calculateMissionParameters(req);
  const basePower = params.requiredPowerW;
  const mass = params.estimatedTakeoffMassKg;
  const heavyMissionPenalty = params.riskLevel === 'High' ? 8 : params.riskLevel === 'Medium' ? 4 : 0;

  const options: DesignOption[] = [
    {
      name: 'Multirotor',
      score: scoreOption(82 - heavyMissionPenalty, req.payloadKg, req.enduranceHours),
      massKg: round(mass * 1.16),
      powerW: basePower,
      risk: params.riskLevel === 'High' ? 'High' : req.enduranceHours > 2.5 ? 'Medium' : 'Low',
      summary: 'Лучше для вертикального взлёта, точной посадки и тестов прототипа.',
    },
    {
      name: 'Fixed Wing',
      score: scoreOption(94 - heavyMissionPenalty, req.payloadKg - 2, req.enduranceHours - 1),
      massKg: round(mass * 0.94),
      powerW: Math.round(basePower * 0.68),
      risk: params.riskLevel === 'High' ? 'Medium' : req.rangeKm > 80 ? 'Medium' : 'Low',
      summary: 'Самый энергоэффективный вариант для дальности и длительного полёта.',
    },
    {
      name: 'Hybrid VTOL',
      score: scoreOption(89 - heavyMissionPenalty, req.payloadKg - 1, req.enduranceHours - 0.5),
      massKg: round(mass * 1.04),
      powerW: Math.round(basePower * 0.82),
      risk: 'Medium',
      summary: 'Компромисс: вертикальный старт плюс экономичный маршрутный полёт.',
    },
    {
      name: 'CubeSat / Satellite',
      score: scoreOption(78 - heavyMissionPenalty, req.payloadKg + 1, req.enduranceHours),
      massKg: round(mass * 0.72),
      powerW: Math.round(basePower * 0.38 + req.payloadPowerW),
      risk: req.vehicleScheme === 'cubesat-satellite' ? 'Medium' : 'High',
      summary: 'Подходит для орбитальной полезной нагрузки и ограниченного габарита.',
    },
  ];

  return options.sort((a, b) => b.score - a.score);
}

export function calculateMissionParameters(req: MissionRequirements): CalculatedParameters {
  const engineFactor = req.engineType === 'turbine' ? 1.22 : req.engineType === 'hybrid' ? 1.1 : 1;
  const materialMassFactor = getMaterialMassFactor(req.material);
  const energyMassFactor = req.energySource === 'fuel-cell' ? 1.12 : req.energySource === 'solar' ? 1.06 : 1;
  const energyReserveFactor = req.energySource === 'fuel-cell' ? 0.9 : req.energySource === 'solar' ? 0.84 : 1;
  const environmentFactor = getEnvironmentFactor(req.environment);
  const speedFactor = req.speedKmh > 90 ? 1.18 : 1;
  const schemeFactor = req.vehicleScheme === 'multirotor' ? 1.18 : req.vehicleScheme === 'cubesat-satellite' ? 1.35 : 1;
  const designLoadKg = round(req.payloadKg + req.rangeKm / 20 + req.enduranceHours * 1.8 + req.takeoffMassKg / 18);
  const spacePowerOffset = req.vehicleDomain === 'spacecraft' ? req.solarArrayW * 0.42 : 0;
  const requiredPowerW = Math.max(
    req.payloadPowerW,
    Math.round(designLoadKg * 95 * environmentFactor * speedFactor * engineFactor + req.payloadPowerW - spacePowerOffset),
  );
  const averagePowerW = Math.round(requiredPowerW * (req.vehicleScheme === 'fixed-wing' ? 0.72 : 0.86));
  const peakPowerW = Math.round(requiredPowerW * (req.vehicleScheme === 'multirotor' ? 1.42 : 1.24));
  const requiredEnergyWh = Math.round(requiredPowerW * req.enduranceHours * 1.25 * energyReserveFactor * schemeFactor);
  const rawMass = req.payloadKg * 2.5 + req.enduranceHours * 2.2 + req.rangeKm / 12;
  const estimatedTakeoffMassKg = round(Math.max(req.takeoffMassKg, rawMass * materialMassFactor * energyMassFactor));
  const wingAreaM2 = round(Math.max(0.18, estimatedTakeoffMassKg / (req.vehicleScheme === 'multirotor' ? 84 : 68)));
  const wingSpanM = round(Math.min(req.maxDimensionM, Math.sqrt(wingAreaM2 * (req.vehicleScheme === 'fixed-wing' ? 8.2 : 5.4))));
  const liftToDrag = round(req.vehicleScheme === 'fixed-wing' ? 13.5 : req.vehicleScheme === 'hybrid-vtol' ? 9.2 : 4.8);
  const wingOrDiskLoading = Math.round((estimatedTakeoffMassKg * 9.81) / wingAreaM2);
  const loadFactorG = req.vehicleDomain === 'spacecraft' ? 6 : 3.5;
  const limitLoadKg = estimatedTakeoffMassKg * loadFactorG;
  const marginOfSafety = round((req.takeoffMassKg * 1.5 * loadFactorG - limitLoadKg) / limitLoadKg);
  const manufacturingComplexityPercent = getManufacturingComplexity(req);
  const manufacturingToleranceMm = getManufacturingTolerance(req);
  const leadTimeHours = getLeadTimeHours(req);
  const ndtMethod = getNdtMethod(req);
  const emergencyReservePercent = Math.max(8, Math.min(35, Math.round(req.batterySohPercent * 0.22)));
  const linkQualityPercent = getLinkQuality(req);
  const serviceLifeHours = Math.max(0, Math.round(100 - req.flightHours * 0.72 - Math.max(0, req.vibrationG - 0.35) * 35));
  const onboardComputerTempC = Math.round(req.motorTempC * 0.72 + 12);
  const anomalyStatus = getAnomalyStatus(req, emergencyReservePercent, linkQualityPercent, serviceLifeHours);
  const batteryReservePercent = Math.max(
    12,
    Math.min(38, Math.round(30 - req.enduranceHours * 3 + (req.energySource === 'solar' ? 6 : 0))),
  );
  const riskLevel = getRiskLevel(req, requiredPowerW, estimatedTakeoffMassKg);

  return {
    estimatedTakeoffMassKg,
    requiredPowerW,
    averagePowerW,
    peakPowerW,
    requiredEnergyWh,
    wingAreaM2,
    wingSpanM,
    liftToDrag,
    wingOrDiskLoading,
    marginOfSafety,
    loadFactorG,
    manufacturingComplexityPercent,
    manufacturingToleranceMm,
    leadTimeHours,
    ndtMethod,
    emergencyReservePercent,
    linkQualityPercent,
    serviceLifeHours,
    anomalyStatus,
    onboardComputerTempC,
    batteryReservePercent,
    designLoadKg,
    riskLevel,
    materialAdvice: getMaterialAdvice(req, estimatedTakeoffMassKg),
    energyAdvice: getEnergyAdvice(req),
    operationAdvice: getOperationAdvice(req, riskLevel),
  };
}

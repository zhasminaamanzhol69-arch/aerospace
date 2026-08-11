export type MissionRequirements = {
  payloadKg: number;
  enduranceHours: number;
  rangeKm: number;
  speedKmh: number;
  engineType: string;
  material: string;
  energySource: string;
  environment: string;
};

export type DesignOption = {
  name: string;
  score: number;
  massKg: number;
  powerW: number;
  risk: 'Low' | 'Medium' | 'High';
  summary: string;
};

export type CalculatedParameters = {
  estimatedTakeoffMassKg: number;
  requiredPowerW: number;
  requiredEnergyWh: number;
  batteryReservePercent: number;
  designLoadKg: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  materialAdvice: 'carbon' | 'aluminum' | 'titanium';
  energyAdvice: 'li-ion' | 'fuel-cell' | 'solar';
  operationAdvice: 'reduce-load' | 'thermal-protection' | 'standard-check';
};

export const defaultRequirements: MissionRequirements = {
  payloadKg: 5,
  enduranceHours: 2,
  rangeKm: 35,
  speedKmh: 70,
  engineType: 'electric',
  material: 'carbon',
  energySource: 'li-ion',
  environment: 'cold',
};

export function buildDesignOptions(req: MissionRequirements): DesignOption[] {
  const params = calculateMissionParameters(req);
  const basePower = params.requiredPowerW;
  const mass = params.estimatedTakeoffMassKg;
  const heavyMissionPenalty = params.riskLevel === 'High' ? 8 : params.riskLevel === 'Medium' ? 4 : 0;

  const options: DesignOption[] = [
    {
      name: 'Quad VTOL UAV',
      score: scoreOption(86 - heavyMissionPenalty, req.payloadKg, req.enduranceHours),
      massKg: round(mass * 1.12),
      powerW: basePower,
      risk: params.riskLevel === 'High' ? 'High' : req.enduranceHours > 2.5 ? 'Medium' : 'Low',
      summary: 'Лучше для вертикального взлёта, точной посадки и тестов прототипа.',
    },
    {
      name: 'Fixed Wing UAV',
      score: scoreOption(92 - heavyMissionPenalty, req.payloadKg - 2, req.enduranceHours - 1),
      massKg: round(mass * 0.94),
      powerW: Math.round(basePower * 0.68),
      risk: params.riskLevel === 'High' ? 'Medium' : req.rangeKm > 80 ? 'Medium' : 'Low',
      summary: 'Самый энергоэффективный вариант для дальности и длительного полёта.',
    },
    {
      name: 'Hybrid VTOL Wing',
      score: scoreOption(89 - heavyMissionPenalty, req.payloadKg - 1, req.enduranceHours - 0.5),
      massKg: round(mass * 1.04),
      powerW: Math.round(basePower * 0.82),
      risk: 'Medium',
      summary: 'Компромисс: вертикальный старт плюс экономичный маршрутный полёт.',
    },
  ];

  return options.sort((a, b) => b.score - a.score);
}

export function calculateMissionParameters(req: MissionRequirements): CalculatedParameters {
  const engineFactor = req.engineType === 'turbine' ? 1.22 : req.engineType === 'hybrid' ? 1.1 : 1;
  const materialMassFactor = req.material === 'carbon' ? 0.88 : req.material === 'titanium' ? 1.16 : 1;
  const energyMassFactor = req.energySource === 'fuel-cell' ? 1.12 : req.energySource === 'solar' ? 1.06 : 1;
  const energyReserveFactor = req.energySource === 'fuel-cell' ? 0.9 : req.energySource === 'solar' ? 0.84 : 1;
  const environmentFactor = req.environment === 'cold' ? 1.16 : req.environment === 'desert' ? 1.12 : 1.04;
  const speedFactor = req.speedKmh > 90 ? 1.18 : 1;
  const designLoadKg = round(req.payloadKg + req.rangeKm / 20 + req.enduranceHours * 1.8);
  const requiredPowerW = Math.round(designLoadKg * 95 * environmentFactor * speedFactor * engineFactor);
  const requiredEnergyWh = Math.round(requiredPowerW * req.enduranceHours * 1.25 * energyReserveFactor);
  const rawMass = req.payloadKg * 2.5 + req.enduranceHours * 2.2 + req.rangeKm / 12;
  const estimatedTakeoffMassKg = round(rawMass * materialMassFactor * energyMassFactor);
  const batteryReservePercent = Math.max(
    12,
    Math.min(38, Math.round(30 - req.enduranceHours * 3 + (req.energySource === 'solar' ? 6 : 0))),
  );
  const riskLevel = getRiskLevel(req, requiredPowerW, estimatedTakeoffMassKg);

  return {
    estimatedTakeoffMassKg,
    requiredPowerW,
    requiredEnergyWh,
    batteryReservePercent,
    designLoadKg,
    riskLevel,
    materialAdvice: getMaterialAdvice(req, estimatedTakeoffMassKg),
    energyAdvice: getEnergyAdvice(req),
    operationAdvice: getOperationAdvice(req, riskLevel),
  };
}

function getRiskLevel(req: MissionRequirements, powerW: number, massKg: number) {
  if (req.enduranceHours > 3 || req.rangeKm > 90 || powerW > 1600 || massKg > 28) return 'High';
  if (powerW > 1100 || req.environment !== 'urban' || req.payloadKg > 8) return 'Medium';
  return 'Low';
}

function getMaterialAdvice(req: MissionRequirements, massKg: number) {
  if (massKg > 24 || req.rangeKm > 70) return 'carbon';
  if (req.environment === 'desert' || req.engineType === 'turbine') return 'titanium';
  return 'aluminum';
}

function getEnergyAdvice(req: MissionRequirements) {
  if (req.enduranceHours > 3 || req.rangeKm > 80) return 'fuel-cell';
  if (req.environment === 'desert' && req.enduranceHours > 2) return 'solar';
  return 'li-ion';
}

function getOperationAdvice(req: MissionRequirements, riskLevel: CalculatedParameters['riskLevel']) {
  if (riskLevel === 'High' || req.payloadKg > 8) return 'reduce-load';
  if (req.environment === 'cold' || req.environment === 'desert') return 'thermal-protection';
  return 'standard-check';
}

function scoreOption(base: number, payloadFactor: number, enduranceFactor: number) {
  return Math.max(58, Math.min(98, Math.round(base - payloadFactor * 1.8 - enduranceFactor * 2.4)));
}

function round(value: number) {
  return Math.round(value * 10) / 10;
}

import type { CalculatedParameters, MissionRequirements } from './aerospace';

export function getRiskLevel(req: MissionRequirements, powerW: number, massKg: number) {
  const harshEnvironment = ['cold', 'wind', 'space', 'desert', 'vacuum', 'radiation', 'thermal-cycle'].includes(req.environment);
  if (req.enduranceHours > 3 || req.rangeKm > 90 || powerW > 1600 || massKg > 28) return 'High';
  if (req.vehicleDomain === 'spacecraft' && req.radiationToleranceKrad < 15) return 'High';
  if (req.resourcePercent < 35 || req.productionVolume > 50 || req.jointMethod === 'welding') return 'High';
  if (powerW > 1100 || harshEnvironment || req.payloadKg > 8) return 'Medium';
  return 'Low';
}

export function getMaterialAdvice(req: MissionRequirements, massKg: number) {
  if (massKg > 24 || req.rangeKm > 70) return 'carbon';
  const harshEnvironment = ['space', 'desert', 'vacuum', 'radiation', 'thermal-cycle'].includes(req.environment);
  if (harshEnvironment || req.engineType === 'turbine') return 'titanium';
  return 'aluminum';
}

export function getEnergyAdvice(req: MissionRequirements) {
  if (req.enduranceHours > 3 || req.rangeKm > 80) return 'fuel-cell';
  if (req.environment === 'desert' && req.enduranceHours > 2) return 'solar';
  return 'li-ion';
}

export function getOperationAdvice(req: MissionRequirements, riskLevel: CalculatedParameters['riskLevel']) {
  if (riskLevel === 'High' || req.payloadKg > 8) return 'reduce-load';
  if (req.environment === 'cold' || req.environment === 'desert') return 'thermal-protection';
  return 'standard-check';
}

export function scoreOption(base: number, payloadFactor: number, enduranceFactor: number) {
  return Math.max(58, Math.min(98, Math.round(base - payloadFactor * 1.8 - enduranceFactor * 2.4)));
}

export function round(value: number) {
  return Math.round(value * 10) / 10;
}

export function getMaterialMassFactor(material: string) {
  if (material === 'carbon') return 0.88;
  if (material === 'titanium') return 1.16;
  if (material === 'aluminum-2024') return 1.02;
  if (material === 'aluminum-7075') return 0.98;
  return 1;
}

export function getEnvironmentFactor(environment: string) {
  if (environment === 'cold') return 1.16;
  if (environment === 'wind') return 1.18;
  if (environment === 'space') return 1.26;
  if (environment === 'desert') return 1.12;
  if (environment === 'vacuum') return 1.2;
  if (environment === 'radiation') return 1.24;
  if (environment === 'thermal-cycle') return 1.28;
  return 1.04;
}

export function getManufacturingComplexity(req: MissionRequirements) {
  const materialScore = req.material === 'titanium' ? 32 : req.material === 'carbon' ? 28 : req.material.includes('dmls') ? 34 : 18;
  const methodScore = req.manufacturingMethod === 'autoclave' ? 28 : req.manufacturingMethod === 'dmls' ? 34 : req.manufacturingMethod === 'cnc' ? 20 : 24;
  const jointScore = req.jointMethod === 'welding' ? 18 : req.jointMethod === 'adhesive' ? 14 : 10;
  return Math.min(96, materialScore + methodScore + jointScore);
}

export function getManufacturingTolerance(req: MissionRequirements) {
  if (req.manufacturingMethod === 'cnc') return 0.05;
  if (req.manufacturingMethod === 'dmls') return 0.12;
  if (req.manufacturingMethod === 'autoclave') return 0.2;
  if (req.manufacturingMethod === 'vacuum-infusion') return 0.35;
  return 0.25;
}

export function getLeadTimeHours(req: MissionRequirements) {
  const base = req.manufacturingMethod === 'autoclave' ? 48 : req.manufacturingMethod === 'cnc' ? 18 : req.manufacturingMethod === 'dmls' ? 36 : 30;
  const materialFactor = req.material === 'titanium' ? 1.45 : req.material === 'carbon' ? 1.2 : 1;
  const scaleFactor = req.productionScale === 'prototype' ? 1.35 : req.productionScale === 'serial' ? 0.72 : 1;
  return Math.round(base * materialFactor * scaleFactor);
}

export function getNdtMethod(req: MissionRequirements) {
  if (req.material === 'carbon') return 'Ultrasound C-Scan';
  if (req.vehicleDomain === 'spacecraft') return 'X-ray + TVAC inspection';
  if (req.manufacturingMethod === 'dmls') return 'X-ray CT';
  if (req.jointMethod === 'welding') return 'Radiography + dye penetrant';
  return 'Dye penetrant + visual';
}

export function getLinkQuality(req: MissionRequirements) {
  const rssiScore = Math.max(0, Math.min(100, Math.round((req.linkRssiDbm + 100) * 2.2)));
  const satelliteScore = Math.min(100, req.satelliteCount * 7);
  const latencyPenalty = Math.max(0, req.telemetryLatencyMs - 80) * 0.18;
  return Math.max(0, Math.round((rssiScore + satelliteScore) / 2 - latencyPenalty));
}

export function getAnomalyStatus(
  req: MissionRequirements,
  reserve: number,
  linkQuality: number,
  serviceLifeHours: number,
): 'OK' | 'Warning' {
  if (req.motorTempC > 85 || reserve < 20 || linkQuality < 55) return 'Warning';
  if (serviceLifeHours < 20 || req.vibrationG > 0.6 || req.checkType === 'hard-landing') return 'Warning';
  return 'OK';
}

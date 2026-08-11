export type MissionRequirements = {
  payloadKg: number;
  payloadPowerW: number;
  enduranceHours: number;
  rangeKm: number;
  speedKmh: number;
  takeoffMassKg: number;
  altitudeKm: number;
  maxDimensionM: number;
  vehicleScheme: string;
  engineType: string;
  material: string;
  manufacturingMethod: string;
  energySource: string;
  environment: string;
  jointMethod: string;
  productionScale: string;
  productionVolume: number;
  missionMode: string;
  batterySohPercent: number;
  motorTempC: number;
  flightHours: number;
  checkType: string;
  linkRssiDbm: number;
  satelliteCount: number;
  telemetryLatencyMs: number;
  vibrationG: number;
  batteryVoltageV: number;
  resourcePercent: number;
  checklistStatus: string;
  vehicleDomain: 'aviation' | 'spacecraft';
  orbitClass: string;
  thermalControl: string;
  solarArrayW: number;
  radiationToleranceKrad: number;
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
  averagePowerW: number;
  peakPowerW: number;
  requiredEnergyWh: number;
  wingAreaM2: number;
  wingSpanM: number;
  liftToDrag: number;
  wingOrDiskLoading: number;
  marginOfSafety: number;
  loadFactorG: number;
  manufacturingComplexityPercent: number;
  manufacturingToleranceMm: number;
  leadTimeHours: number;
  ndtMethod: string;
  emergencyReservePercent: number;
  linkQualityPercent: number;
  serviceLifeHours: number;
  anomalyStatus: 'OK' | 'Warning';
  onboardComputerTempC: number;
  batteryReservePercent: number;
  designLoadKg: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  materialAdvice: 'carbon' | 'aluminum' | 'titanium';
  energyAdvice: 'li-ion' | 'fuel-cell' | 'solar';
  operationAdvice: 'reduce-load' | 'thermal-protection' | 'standard-check';
};

export const defaultRequirements: MissionRequirements = {
  payloadKg: 5,
  payloadPowerW: 120,
  enduranceHours: 2,
  rangeKm: 35,
  speedKmh: 70,
  takeoffMassKg: 17,
  altitudeKm: 1.2,
  maxDimensionM: 2.4,
  vehicleScheme: 'fixed-wing',
  engineType: 'electric',
  material: 'carbon',
  manufacturingMethod: 'autoclave',
  energySource: 'li-ion',
  environment: 'cold',
  jointMethod: 'riveting',
  productionScale: 'small-batch',
  productionVolume: 12,
  missionMode: 'waypoint',
  batterySohPercent: 92,
  motorTempC: 68,
  flightHours: 58,
  checkType: 'preflight',
  linkRssiDbm: -62,
  satelliteCount: 14,
  telemetryLatencyMs: 80,
  vibrationG: 0.4,
  batteryVoltageV: 14.8,
  resourcePercent: 78,
  checklistStatus: 'ready',
  vehicleDomain: 'aviation',
  orbitClass: 'leo',
  thermalControl: 'passive',
  solarArrayW: 180,
  radiationToleranceKrad: 20,
};

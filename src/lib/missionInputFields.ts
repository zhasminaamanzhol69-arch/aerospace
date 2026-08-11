import type { EngineeringStage } from './engineeringStage';
import type { VehicleDomain } from './vehicleDomain';

export function getMissionInputFields(stage: EngineeringStage, domain: VehicleDomain) {
  if (stage === 'manufacturing') return ['productionVolume'] as const;
  if (stage === 'operations') {
    return [
      'batterySohPercent',
      'motorTempC',
      'flightHours',
      'linkRssiDbm',
      'satelliteCount',
      'telemetryLatencyMs',
    ] as const;
  }

  if (domain === 'spacecraft') {
    return [
      'payloadKg',
      'payloadPowerW',
      'altitudeKm',
      'solarArrayW',
      'radiationToleranceKrad',
      'maxDimensionM',
    ] as const;
  }

  return [
    'payloadKg',
    'payloadPowerW',
    'rangeKm',
    'enduranceHours',
    'altitudeKm',
    'takeoffMassKg',
    'maxDimensionM',
  ] as const;
}

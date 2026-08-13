import type { CalculatedParameters, DesignOption, MissionRequirements } from './aerospace';

export function buildMassBreakdown(req: MissionRequirements, params: CalculatedParameters) {
  const payload = req.payloadKg;
  const energy = Math.max(0.8, params.requiredEnergyWh / 240);
  const propulsion = Math.max(1.2, params.requiredPowerW / 520);
  const structure = Math.max(1, params.estimatedTakeoffMassKg - payload - energy - propulsion);
  return normalize([
    { label: 'Payload', value: payload },
    { label: 'Energy', value: energy },
    { label: 'Propulsion', value: propulsion },
    { label: 'Structure', value: structure },
  ]);
}

export function buildEnergyBreakdown(req: MissionRequirements, params: CalculatedParameters) {
  const payload = req.payloadPowerW;
  const propulsion = Math.max(1, params.averagePowerW - payload);
  const avionics = req.vehicleDomain === 'spacecraft' ? 38 : 24;
  const reserve = params.peakPowerW - params.averagePowerW;
  return normalize([
    { label: 'Propulsion', value: propulsion },
    { label: 'Payload', value: payload },
    { label: 'Avionics', value: avionics },
    { label: 'Reserve', value: reserve },
  ]);
}

export function buildDfmItems(req: MissionRequirements) {
  const thinWallRisk = req.maxDimensionM < 1.2 && req.manufacturingMethod.includes('additive');
  return [
    { label: 'Минимальная стенка', status: thinWallRisk ? 'Warning' : 'OK', note: thinWallRisk ? 'Проверить толщину под SLS/SLA.' : 'Геометрия пригодна для выбранного процесса.' },
    { label: 'Доступ инструмента', status: req.manufacturingMethod === 'cnc' && req.maxDimensionM > 3 ? 'Warning' : 'OK', note: 'Проверка под ЧПУ, оснастку и фиксацию.' },
    { label: 'Совместимость материалов', status: req.material === 'carbon' && req.jointMethod === 'welding' ? 'Warning' : 'OK', note: 'Сопоставление материала, соединения и контроля качества.' },
    { label: 'NDT контроль', status: 'OK', note: 'Применить метод дефектоскопии из производственных метрик.' },
  ];
}

export function estimateUnitCost(req: MissionRequirements, params: CalculatedParameters) {
  const materialRate = req.material === 'titanium' ? 92 : req.material === 'carbon' ? 58 : req.material.includes('aluminum') ? 34 : 18;
  const processRate = req.manufacturingMethod === 'dmls' ? 78 : req.manufacturingMethod === 'autoclave' ? 64 : req.manufacturingMethod === 'cnc' ? 52 : 38;
  const scaleDiscount = req.productionScale === 'serial' ? 0.68 : req.productionScale === 'small-batch' ? 0.84 : 1;
  return Math.round((params.estimatedTakeoffMassKg * materialRate + params.leadTimeHours * processRate) * scaleDiscount);
}

export function buildTelemetry(req: MissionRequirements, params: CalculatedParameters) {
  const time = Date.now() / 1000;
  return {
    altitude: req.vehicleDomain === 'spacecraft' ? `${req.altitudeKm.toFixed(0)} km` : `${Math.round(req.altitudeKm * 1000 + Math.sin(time) * 12)} m`,
    speed: req.vehicleDomain === 'spacecraft' ? '7.6 km/s' : `${Math.round(req.speedKmh + Math.sin(time * 0.8) * 4)} km/h`,
    battery: `${Math.max(0, Math.round(req.batterySohPercent - req.enduranceHours * 3))}%`,
    temperature: `${Math.round(req.motorTempC + Math.sin(time * 1.3) * 3)}°C`,
    vibration: `${Math.max(0, req.vibrationG + Math.sin(time * 2.1) * 0.04).toFixed(2)}g`,
    status: params.anomalyStatus,
  };
}

export function bestConfiguration(options: DesignOption[]) {
  return options[0] ?? null;
}

function normalize(items: { label: string; value: number }[]) {
  const total = items.reduce((sum, item) => sum + Math.max(0, item.value), 0) || 1;
  return items.map((item) => ({ ...item, percent: Math.round((Math.max(0, item.value) / total) * 100) }));
}

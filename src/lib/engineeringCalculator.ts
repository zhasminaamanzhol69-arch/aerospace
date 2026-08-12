import type { CalculatedParameters, MissionRequirements } from './aerospace';

export type CalculatorResult = {
  id: string;
  title: string;
  formula: string;
  inputs: string[];
  result: string;
  note: string;
};

const g = 9.81;

export function buildEngineeringCalculations(
  req: MissionRequirements,
  params: CalculatedParameters,
): CalculatorResult[] {
  const forceN = params.estimatedTakeoffMassKg * params.loadFactorG * g;
  const areaM2 = Math.max(0.00045, req.maxDimensionM * 0.00035);
  const lengthM = Math.max(0.25, req.maxDimensionM * 0.42);
  const youngModulusPa = getYoungModulusPa(req.material);
  const volumeM3 = Math.max(0.002, params.wingAreaM2 * req.maxDimensionM * 0.018);
  const density = getDensity(req.material);
  const speedMs = Math.max(1, req.speedKmh / 3.6);
  const rho = req.vehicleDomain === 'spacecraft' ? 0 : getAirDensity(req.altitudeKm);
  const dynamicPressure = 0.5 * rho * speedMs ** 2;
  const liftN = dynamicPressure * params.wingAreaM2 * 0.72;
  const dragN = params.liftToDrag > 0 ? liftN / params.liftToDrag : 0;
  const heatW = req.vehicleDomain === 'spacecraft'
    ? req.solarArrayW * 0.38 + req.payloadPowerW * 0.62
    : req.payloadPowerW + params.averagePowerW * 0.18;
  const consumption = req.rangeKm > 0 ? params.requiredEnergyWh / req.rangeKm : params.requiredEnergyWh;
  const centerOfGravity = getCenterOfGravity(req.maxDimensionM, req.payloadKg, params.estimatedTakeoffMassKg);
  const rootTolerance = Math.sqrt(0.08 ** 2 + 0.05 ** 2 + params.manufacturingToleranceMm ** 2);

  return [
    {
      id: 'stress',
      title: 'Прочность / напряжение',
      formula: 'sigma = F / A; F = m * n * g',
      inputs: [`m=${params.estimatedTakeoffMassKg} kg`, `n=${params.loadFactorG} g`, `A=${round(areaM2, 6)} m2`],
      result: `${round(forceN / areaM2 / 1_000_000, 2)} MPa`,
      note: 'Сравнить с допускаемым напряжением выбранного материала по паспорту или стандарту.',
    },
    {
      id: 'deformation',
      title: 'Деформация элемента',
      formula: 'Delta L = F * L / (A * E)',
      inputs: [`F=${round(forceN, 1)} N`, `L=${round(lengthM, 2)} m`, `E=${round(youngModulusPa / 1_000_000_000, 1)} GPa`],
      result: `${round((forceN * lengthM) / (areaM2 * youngModulusPa) * 1000, 3)} mm`,
      note: 'Расчёт линейный; для композитов нужна проверка по слоям и ориентации волокон.',
    },
    {
      id: 'mass',
      title: 'Оценка массы конструкции',
      formula: 'm = rho * V',
      inputs: [`rho=${density} kg/m3`, `V=${round(volumeM3, 4)} m3`],
      result: `${round(density * volumeM3, 2)} kg`,
      note: 'Используется приближённый объём силовой оболочки по текущей геометрии.',
    },
    {
      id: 'cg',
      title: 'Центровка',
      formula: 'x_cg = sum(m_i * x_i) / sum(m_i)',
      inputs: [`m_payload=${req.payloadKg} kg`, `x_payload=${round(req.maxDimensionM * 0.62, 2)} m`, `L=${req.maxDimensionM} m`],
      result: `${centerOfGravity} m from nose / base edge`,
      note: 'Для финальной компоновки нужна ведомость масс всех агрегатов.',
    },
    {
      id: 'aero',
      title: 'Аэродинамика',
      formula: 'q = 0.5 * rho * V2; L = q * S * CL',
      inputs: [`rho=${round(rho, 3)} kg/m3`, `V=${round(speedMs, 1)} m/s`, `S=${params.wingAreaM2} m2`],
      result: `q=${round(dynamicPressure, 1)} Pa; L=${round(liftN, 1)} N; D=${round(dragN, 1)} N`,
      note: req.vehicleDomain === 'spacecraft' ? 'Для космоса аэродинамика в вакууме не применяется.' : 'CL принят как учебная оценка 0.72.',
    },
    {
      id: 'thermal',
      title: 'Тепловой расчёт',
      formula: 'Q_dot = P_loss + external heat',
      inputs: [`P_avg=${params.averagePowerW} W`, `payload=${req.payloadPowerW} W`, `solar=${req.solarArrayW} W`],
      result: `${round(heatW, 1)} W heat load`,
      note: 'Для спутника требуется отдельный радиационный баланс и термоциклирование.',
    },
    {
      id: 'consumption',
      title: 'Расход энергии',
      formula: 'e = E_required / range',
      inputs: [`E=${params.requiredEnergyWh} Wh`, `range=${req.rangeKm} km`],
      result: `${round(consumption, 2)} Wh/km`,
      note: 'Если миссия висения или орбитальная, показатель Wh/km использовать только справочно.',
    },
    {
      id: 'margin',
      title: 'Запас прочности',
      formula: 'MS = allowable / applied - 1',
      inputs: [`local allowable=${round(req.takeoffMassKg * 1.5 * params.loadFactorG, 2)} kgf`, `applied=${round(params.estimatedTakeoffMassKg * params.loadFactorG, 2)} kgf`],
      result: `MS=${params.marginOfSafety}`,
      note: 'Отрицательный MS означает, что текущий лимит массы/нагрузки недостаточен.',
    },
    {
      id: 'tolerance',
      title: 'Размерная цепь',
      formula: 'T_total = sqrt(T1^2 + T2^2 + T3^2)',
      inputs: ['T1=0.08 mm', 'T2=0.05 mm', `T3=${params.manufacturingToleranceMm} mm`],
      result: `±${round(rootTolerance, 3)} mm`,
      note: 'RSS-оценка подходит для независимых допусков; worst-case считается суммой модулей.',
    },
  ];
}

function getDensity(material: string) {
  if (material === 'carbon') return 1600;
  if (material.includes('aluminum')) return 2810;
  if (material === 'titanium') return 4430;
  return 1200;
}

function getYoungModulusPa(material: string) {
  if (material === 'carbon') return 70_000_000_000;
  if (material.includes('aluminum')) return 71_000_000_000;
  if (material === 'titanium') return 114_000_000_000;
  return 2_200_000_000;
}

function getAirDensity(altitudeKm: number) {
  return 1.225 * Math.exp(-Math.max(0, altitudeKm) / 8.5);
}

function getCenterOfGravity(lengthM: number, payloadKg: number, totalKg: number) {
  const structureKg = Math.max(0.1, totalKg - payloadKg);
  return round((payloadKg * lengthM * 0.62 + structureKg * lengthM * 0.45) / totalKg, 2);
}

function round(value: number, digits = 2) {
  return Number(value.toFixed(digits));
}

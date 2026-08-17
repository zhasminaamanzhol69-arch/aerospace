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
      formula: 'σ = F / A,  F = m · n · g',
      inputs: [`масса = ${params.estimatedTakeoffMassKg} кг`, `перегрузка = ${params.loadFactorG} g`, `площадь = ${round(areaM2, 6)} м²`],
      result: `${round(forceN / areaM2 / 1_000_000, 2)} МПа`,
      note: 'Сравнить с допускаемым напряжением выбранного материала по паспорту или стандарту.',
    },
    {
      id: 'deformation',
      title: 'Деформация элемента',
      formula: 'ΔL = F · L / (A · E)',
      inputs: [`сила = ${round(forceN, 1)} Н`, `длина = ${round(lengthM, 2)} м`, `модуль упругости = ${round(youngModulusPa / 1_000_000_000, 1)} ГПа`],
      result: `${round((forceN * lengthM) / (areaM2 * youngModulusPa) * 1000, 3)} мм`,
      note: 'Расчёт линейный; для композитов нужна проверка по слоям и ориентации волокон.',
    },
    {
      id: 'mass',
      title: 'Оценка массы конструкции',
      formula: 'm = ρ · V',
      inputs: [`плотность = ${density} кг/м³`, `объём = ${round(volumeM3, 4)} м³`],
      result: `${round(density * volumeM3, 2)} кг`,
      note: 'Используется приближённый объём силовой оболочки по текущей геометрии.',
    },
    {
      id: 'cg',
      title: 'Центровка',
      formula: 'x₍цм₎ = Σ(mᵢ · xᵢ) / Σmᵢ',
      inputs: [`полезная нагрузка = ${req.payloadKg} кг`, `координата нагрузки = ${round(req.maxDimensionM * 0.62, 2)} м`, `длина аппарата = ${req.maxDimensionM} м`],
      result: `${centerOfGravity} м от носа / базовой кромки`,
      note: 'Для финальной компоновки нужна ведомость масс всех агрегатов.',
    },
    {
      id: 'aero',
      title: 'Аэродинамика',
      formula: 'q = ½ · ρ · V²,  L = q · S · Cₗ',
      inputs: [`плотность воздуха = ${round(rho, 3)} кг/м³`, `скорость = ${round(speedMs, 1)} м/с`, `площадь крыла = ${params.wingAreaM2} м²`],
      result: `напор ${round(dynamicPressure, 1)} Па; подъёмная сила ${round(liftN, 1)} Н; сопротивление ${round(dragN, 1)} Н`,
      note: req.vehicleDomain === 'spacecraft' ? 'Для космоса аэродинамика в вакууме не применяется.' : 'CL принят как учебная оценка 0.72.',
    },
    {
      id: 'thermal',
      title: 'Тепловой расчёт',
      formula: 'Q̇ = P₍потери₎ + Q₍внешн₎',
      inputs: [`средняя мощность = ${params.averagePowerW} Вт`, `полезная нагрузка = ${req.payloadPowerW} Вт`, `солнечные панели = ${req.solarArrayW} Вт`],
      result: `${round(heatW, 1)} Вт тепловой нагрузки`,
      note: 'Для спутника требуется отдельный радиационный баланс и термоциклирование.',
    },
    {
      id: 'consumption',
      title: 'Расход энергии',
      formula: 'e = E₍треб₎ / R',
      inputs: [`энергия = ${params.requiredEnergyWh} Вт·ч`, `дальность = ${req.rangeKm} км`],
      result: `${round(consumption, 2)} Вт·ч/км`,
      note: 'Если миссия висения или орбитальная, показатель Wh/km использовать только справочно.',
    },
    {
      id: 'margin',
      title: 'Запас прочности',
      formula: 'MS = F₍доп₎ / F₍раб₎ − 1',
      inputs: [`допустимая нагрузка = ${round(req.takeoffMassKg * 1.5 * params.loadFactorG, 2)} кгс`, `приложенная нагрузка = ${round(params.estimatedTakeoffMassKg * params.loadFactorG, 2)} кгс`],
      result: `запас ${params.marginOfSafety}`,
      note: 'Отрицательный MS означает, что текущий лимит массы/нагрузки недостаточен.',
    },
    {
      id: 'tolerance',
      title: 'Размерная цепь',
      formula: 'TΣ = √(T₁² + T₂² + T₃²)',
      inputs: ['допуск 1 = 0,08 мм', 'допуск 2 = 0,05 мм', `допуск 3 = ${params.manufacturingToleranceMm} мм`],
      result: `±${round(rootTolerance, 3)} мм`,
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

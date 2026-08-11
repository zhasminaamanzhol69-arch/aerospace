export type EngineeringStage = 'design' | 'manufacturing' | 'operations';

export const engineeringStageFocus: Record<EngineeringStage, string> = {
  design: 'standards for structural strength, aerodynamics, orbital mechanics, loads, margins, and design verification',
  manufacturing: 'manufacturing technologies, alloys, composites, joining, assembly, inspection, and process control',
  operations: 'test regulations, preflight checklists, operating procedures, safety instructions, maintenance limits, and anomaly response',
};

export const engineeringStageLabel: Record<EngineeringStage, string> = {
  design: '[Жобалау / Проектирование]',
  manufacturing: '[Дайындау / Производство]',
  operations: '[Пайдалану / Эксплуатация]',
};

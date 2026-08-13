import type { CalculatedParameters, DesignOption, MissionRequirements } from './aerospace';
import type { CalculatorResult } from './engineeringCalculator';
import type { EngineeringStage } from './engineeringStage';

export function downloadEngineeringJson(
  stage: EngineeringStage,
  requirements: MissionRequirements,
  parameters: CalculatedParameters,
  options: DesignOption[],
  calculations: CalculatorResult[],
) {
  const payload = { stage, exportedAt: new Date().toISOString(), requirements, parameters, options, calculations };
  downloadFile('vectori-engineering-report.json', JSON.stringify(payload, null, 2), 'application/json');
}

export function downloadEngineeringCsv(parameters: CalculatedParameters, calculations: CalculatorResult[]) {
  const rows = [
    ['section', 'name', 'value'],
    ...Object.entries(parameters).map(([key, value]) => ['parameters', key, String(value)]),
    ...calculations.map((item) => ['calculation', item.title, item.result]),
  ];
  const csv = rows.map((row) => row.map(escapeCsv).join(',')).join('\n');
  downloadFile('vectori-engineering-report.csv', csv, 'text/csv');
}

export function printEngineeringReport(calculations: CalculatorResult[]) {
  const formulas = calculations
    .map((item) => `<li><strong>${item.title}</strong><br>${item.formula}<br>${item.result}</li>`)
    .join('');
  const popup = window.open('', 'vectori-report', 'width=960,height=720');
  if (!popup) return;
  popup.document.write(`
    <html>
      <head><title>Vectori Engineering Report</title></head>
      <body style="font-family: Inter, Arial, sans-serif; padding: 32px; color: #0f172a;">
        <h1>Vectori Engineering Report</h1>
        <p>Формулы, исходные данные и расчетные результаты для CAD/CAE проверки.</p>
        <ol>${formulas}</ol>
      </body>
    </html>
  `);
  popup.document.close();
  popup.print();
}

function downloadFile(name: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

function escapeCsv(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

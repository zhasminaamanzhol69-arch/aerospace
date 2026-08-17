import type { CalculatedParameters, DesignOption, MissionRequirements } from './aerospace';
import type { CalculatorResult } from './engineeringCalculator';
import type { EngineeringStage } from './engineeringStage';
import { getPdfThemeAssets, type PdfTheme } from './engineeringReportThemes';

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

export function printEngineeringReport(calculations: CalculatorResult[], theme: PdfTheme = 'classic') {
  const themeAssets = getPdfThemeAssets(theme);
  const formulas = calculations
    .map((item, index) => `
      <article class="formula-card">
        <span>${String(index + 1).padStart(2, '0')}</span>
        <div>
          <h2>${item.title}</h2>
          <p class="formula">${item.formula}</p>
          <p class="result">${item.result}</p>
        </div>
      </article>
    `)
    .join('');
  const popup = window.open('', 'vectori-report', 'width=960,height=720');
  if (!popup) return;
  popup.document.write(`
    <html>
      <head>
        <title>Vectori Engineering Report</title>
        <style>${themeAssets.css}</style>
      </head>
      <body>
        ${themeAssets.svg}
        <main>
          <header>
            <p class="eyebrow">${themeAssets.label}</p>
            <h1>Vectori Engineering Report</h1>
            <p class="lead">Формулы, исходные данные и расчётные результаты для CAD/CAE проверки.</p>
          </header>
          <section class="summary-grid">
            <div><span>Формат</span><strong>PDF</strong></div>
            <div><span>Раздел</span><strong>Аналитика</strong></div>
            <div><span>Тип</span><strong>Инженерный расчёт</strong></div>
          </section>
          <section class="formula-list">${formulas}</section>
        </main>
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

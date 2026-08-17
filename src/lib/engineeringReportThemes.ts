export type PdfTheme = 'classic' | 'vector';

export function getPdfThemeAssets(theme: PdfTheme) {
  return theme === 'classic'
    ? { css: classicPdfCss, svg: classicHeroSvg, label: 'Вариант 1 / чистый инженерный отчёт' }
    : { css: vectorPdfCss, svg: vectorHeroSvg, label: 'Вариант 2 / векторный аэрокосмический отчёт' };
}

const basePdfCss = `
  @page { margin: 14mm; }
  * { box-sizing: border-box; }
  body { background: #ffffff; color: #0f172a; font-family: Inter, Arial, sans-serif; margin: 0; }
  main { position: relative; z-index: 1; padding: 32px; }
  header { border-bottom: 2px solid #dbeafe; margin-bottom: 22px; padding-bottom: 20px; }
  .eyebrow { color: #0369a1; font-size: 12px; font-weight: 800; margin: 0 0 10px; text-transform: uppercase; }
  h1 { font-size: 34px; line-height: 1.05; margin: 0; }
  .lead { color: #475569; font-size: 15px; line-height: 1.55; margin: 12px 0 0; max-width: 680px; }
  .summary-grid { display: grid; gap: 10px; grid-template-columns: repeat(3, 1fr); margin-bottom: 18px; }
  .summary-grid div { background: #f8fafc; border: 1px solid #dbeafe; border-radius: 8px; padding: 12px; }
  .summary-grid span { color: #64748b; display: block; font-size: 11px; margin-bottom: 6px; text-transform: uppercase; }
  .summary-grid strong { color: #0f172a; }
  .formula-list { display: grid; gap: 12px; }
  .formula-card { align-items: start; background: #ffffff; border: 1px solid #dbeafe; border-radius: 8px; display: grid; gap: 14px; grid-template-columns: 44px 1fr; padding: 14px; page-break-inside: avoid; }
  .formula-card > span { align-items: center; background: #e0f2fe; border-radius: 8px; color: #075985; display: flex; font-weight: 900; height: 36px; justify-content: center; }
  h2 { font-size: 16px; margin: 0 0 8px; }
  .formula, .result { border-radius: 8px; font-size: 13px; line-height: 1.45; margin: 6px 0 0; padding: 10px; }
  .formula { background: #f1f5f9; color: #334155; }
  .result { background: #ecfeff; color: #155e75; font-weight: 800; }
  svg.decor { height: 210px; position: fixed; right: 0; top: 0; width: 420px; z-index: 0; }
`;

const classicPdfCss = `${basePdfCss} header { padding-right: 170px; } .formula-card { box-shadow: 0 8px 22px rgba(15, 23, 42, 0.05); }`;
const vectorPdfCss = `${basePdfCss} header { background: linear-gradient(135deg, #eff6ff, #ffffff); border: 1px solid #bfdbfe; border-radius: 8px; padding: 24px 180px 24px 24px; } .formula-card { border-left: 5px solid #0284c7; }`;

const classicHeroSvg = `<svg class="decor" viewBox="0 0 420 210" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M48 45H365" stroke="#bfdbfe" stroke-width="2"/><path d="M86 88H322" stroke="#bae6fd" stroke-width="2"/><circle cx="310" cy="68" r="42" fill="#e0f2fe"/><path d="M253 68C277 52 304 45 345 42C317 61 293 78 267 106L253 68Z" fill="#38bdf8"/><path d="M267 106L285 84L324 137L267 106Z" fill="#0ea5e9"/><circle cx="95" cy="126" r="16" fill="#dbeafe"/><circle cx="138" cy="68" r="8" fill="#93c5fd"/></svg>`;
const vectorHeroSvg = `<svg class="decor" viewBox="0 0 420 210" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="308" cy="68" r="46" fill="#dbeafe"/><circle cx="308" cy="68" r="70" stroke="#bae6fd" stroke-width="2"/><path d="M73 150C132 77 218 47 356 52" stroke="#0284c7" stroke-width="3"/><path d="M218 67L362 42L250 118L218 67Z" fill="#38bdf8"/><path d="M250 118L274 92L320 157L250 118Z" fill="#0369a1"/><path d="M44 154H132M58 176H192M86 132H164" stroke="#bfdbfe" stroke-width="2"/></svg>`;

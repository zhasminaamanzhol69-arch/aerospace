import type { ExtractedDocument } from './documentExtraction';

export function buildSourceAttribution(doc: ExtractedDocument, question: string) {
  const words = question.toLowerCase().split(/\W+/).filter((word) => word.length > 4);
  const lines = doc.text.split('\n').filter(Boolean);
  return lines
    .map((line) => ({ line, score: words.filter((word) => line.toLowerCase().includes(word)).length }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((item) => item.line.slice(0, 220));
}

export function buildRevisionDiff(current: ExtractedDocument, previous?: ExtractedDocument | null) {
  if (!previous) return [];
  const previousLines = new Set(normalizeLines(previous.text));
  const currentLines = new Set(normalizeLines(current.text));
  const added = [...currentLines].filter((line) => !previousLines.has(line)).slice(0, 4);
  const removed = [...previousLines].filter((line) => !currentLines.has(line)).slice(0, 4);
  return [
    ...added.map((line) => ({ type: 'added' as const, line })),
    ...removed.map((line) => ({ type: 'removed' as const, line })),
  ];
}

function normalizeLines(text: string) {
  return text
    .split(/[.\n]/)
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter((line) => line.length > 40);
}

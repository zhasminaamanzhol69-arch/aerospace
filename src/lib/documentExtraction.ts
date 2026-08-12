export type ExtractedDocument = {
  name: string;
  type: string;
  text: string;
  pageCount?: number;
};

type PdfTextItem = { str: string };

export async function extractDocumentText(file: File): Promise<ExtractedDocument> {
  const ext = getExtension(file.name);
  const buffer = await file.arrayBuffer();

  if (ext === 'pdf') return extractPdf(file, buffer);
  if (ext === 'docx') return extractDocx(file, buffer);
  if (['txt', 'md', 'csv'].includes(ext)) return extractPlainText(file);

  throw new Error('Поддерживаются PDF, DOCX, TXT, MD и CSV.');
}

async function extractPdf(file: File, buffer: ArrayBuffer): Promise<ExtractedDocument> {
  const pdfjs = await import('pdfjs-dist');
  const worker = await import('pdfjs-dist/build/pdf.worker.mjs?url');
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
  const pdf = await pdfjs.getDocument({ data: new Uint8Array(buffer) }).promise;
  const pages: string[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => (isPdfTextItem(item) ? item.str : ''))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (text) pages.push(`[стр. ${pageNumber}] ${text}`);
  }

  return { name: file.name, type: 'PDF', text: pages.join('\n'), pageCount: pdf.numPages };
}

async function extractDocx(file: File, buffer: ArrayBuffer): Promise<ExtractedDocument> {
  const mammoth = await import('mammoth/mammoth.browser');
  const result = await mammoth.default.extractRawText({ arrayBuffer: buffer });
  return { name: file.name, type: 'DOCX', text: result.value.trim() };
}

async function extractPlainText(file: File): Promise<ExtractedDocument> {
  return { name: file.name, type: 'TEXT', text: (await file.text()).trim() };
}

function getExtension(name: string) {
  return name.split('.').pop()?.toLowerCase() ?? '';
}

function isPdfTextItem(item: unknown): item is PdfTextItem {
  return typeof item === 'object' && item !== null && 'str' in item && typeof item.str === 'string';
}

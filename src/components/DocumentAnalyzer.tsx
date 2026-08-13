import { useState } from 'react';
import { answerDocumentQuestion } from '../lib/documentAi';
import { documentAnalyzerText } from '../lib/documentAnalyzerText';
import { extractDocumentText, type ExtractedDocument } from '../lib/documentExtraction';
import { buildRevisionDiff, buildSourceAttribution } from '../lib/documentInsights';
import { useLanguage } from '../lib/language';
import './DocumentAnalyzer.css';

export function DocumentAnalyzer() {
  const { language } = useLanguage();
  const copy = documentAnalyzerText[language];
  const [current, setCurrent] = useState<ExtractedDocument | null>(null);
  const [previous, setPrevious] = useState<ExtractedDocument | null>(null);
  const [question, setQuestion] = useState(copy.quick[0]);
  const [answer, setAnswer] = useState('');
  const [sources, setSources] = useState<string[]>([]);
  const [diff, setDiff] = useState<ReturnType<typeof buildRevisionDiff>>([]);
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleFile(file: File | undefined, target: 'current' | 'previous') {
    if (!file) return;
    setIsLoading(true);
    setStatus(`${copy.loading} ${file.name}`);
    setAnswer('');

    try {
      const extracted = await extractDocumentText(file);
      if (target === 'current') setCurrent(extracted);
      if (target === 'previous') setPrevious(extracted);
      setStatus(`${copy.done} ${extracted.text.length} ${copy.chars}.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Не удалось прочитать документ.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAsk() {
    if (!current) {
      setStatus(copy.uploadFirst);
      return;
    }

    setIsLoading(true);
    setStatus(copy.analyzing);
    setAnswer('');
    setSources(buildSourceAttribution(current, question));
    setDiff(buildRevisionDiff(current, previous));

    const nextAnswer = await answerDocumentQuestion(current, question.trim(), previous);
    setAnswer(nextAnswer);
    setStatus(copy.done);
    setIsLoading(false);
  }

  return (
    <section className="card document-analyzer">
      <div>
        <p className="eyebrow">PDF / DOCX Document Analysis</p>
        <h2>{copy.title}</h2>
        <p>{copy.body}</p>
      </div>

      <div className="document-upload-grid">
        <FileBox title={copy.current} doc={current} chars={copy.chars} onFile={(file) => handleFile(file, 'current')} />
        <FileBox title={copy.previous} doc={previous} chars={copy.chars} onFile={(file) => handleFile(file, 'previous')} />
      </div>

      <div className="quick-question-grid">
        {copy.quick.map((item) => (
          <button className="ghost" key={item} onClick={() => setQuestion(item)} type="button">
            {item}
          </button>
        ))}
      </div>

      <label className="document-question">
        <span>{copy.question}</span>
        <textarea rows={4} value={question} onChange={(event) => setQuestion(event.target.value)} />
      </label>

      <button type="button" disabled={isLoading} onClick={handleAsk}>
        {isLoading ? copy.loading : copy.ask}
      </button>

      {status && <p className="document-status">{status}</p>}
      {sources.length > 0 && (
        <div className="document-sources">
          <strong>Source Attribution</strong>
          {sources.map((source) => <span key={source}>{source}</span>)}
        </div>
      )}
      {diff.length > 0 && (
        <div className="document-diff">
          <strong>Revision Diff</strong>
          {diff.map((item) => <span className={item.type} key={`${item.type}-${item.line}`}>{item.type === 'added' ? '+ ' : '- '}{item.line}</span>)}
        </div>
      )}
      {answer && <pre className="document-answer">{answer}</pre>}
    </section>
  );
}

function FileBox({
  title,
  doc,
  chars,
  onFile,
}: {
  title: string;
  doc: ExtractedDocument | null;
  chars: string;
  onFile: (file: File | undefined) => void;
}) {
  return (
    <label className="document-file-box">
      <span>{title}</span>
      <input accept=".pdf,.docx,.txt,.md,.csv" type="file" onChange={(event) => onFile(event.target.files?.[0])} />
      {doc && <strong>{doc.name} / {doc.type} / {doc.text.length} {chars}</strong>}
    </label>
  );
}

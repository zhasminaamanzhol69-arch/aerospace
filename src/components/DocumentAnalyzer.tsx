import { useState } from 'react';
import { answerDocumentQuestion } from '../lib/documentAi';
import { extractDocumentText, type ExtractedDocument } from '../lib/documentExtraction';
import './DocumentAnalyzer.css';

const quickQuestions = [
  'Какие требования предъявляются к этому узлу?',
  'Найди все требования по контролю качества.',
  'Какие пункты относятся к эксплуатации?',
  'Сравни эту редакцию с предыдущей.',
];

export function DocumentAnalyzer() {
  const [current, setCurrent] = useState<ExtractedDocument | null>(null);
  const [previous, setPrevious] = useState<ExtractedDocument | null>(null);
  const [question, setQuestion] = useState(quickQuestions[0]);
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleFile(file: File | undefined, target: 'current' | 'previous') {
    if (!file) return;
    setIsLoading(true);
    setStatus(`Читаю документ: ${file.name}`);
    setAnswer('');

    try {
      const extracted = await extractDocumentText(file);
      if (target === 'current') setCurrent(extracted);
      if (target === 'previous') setPrevious(extracted);
      setStatus(`Готово: извлечено ${extracted.text.length} символов.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Не удалось прочитать документ.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAsk() {
    if (!current) {
      setStatus('Сначала загрузите основной документ.');
      return;
    }

    setIsLoading(true);
    setStatus('Анализирую документ...');
    setAnswer('');

    const nextAnswer = await answerDocumentQuestion(current, question.trim(), previous);
    setAnswer(nextAnswer);
    setStatus('Анализ готов.');
    setIsLoading(false);
  }

  return (
    <section className="card document-analyzer">
      <div>
        <p className="eyebrow">PDF / DOCX Document Analysis</p>
        <h2>Анализ инженерного документа</h2>
        <p>Загрузите ТУ, ГОСТ, ОСТ, руководство, чертёжный текст или редакцию документа.</p>
      </div>

      <div className="document-upload-grid">
        <FileBox title="Основной документ" doc={current} onFile={(file) => handleFile(file, 'current')} />
        <FileBox title="Предыдущая редакция" doc={previous} onFile={(file) => handleFile(file, 'previous')} />
      </div>

      <div className="quick-question-grid">
        {quickQuestions.map((item) => (
          <button className="ghost" key={item} onClick={() => setQuestion(item)} type="button">
            {item}
          </button>
        ))}
      </div>

      <label className="document-question">
        <span>Вопрос по документу</span>
        <textarea rows={4} value={question} onChange={(event) => setQuestion(event.target.value)} />
      </label>

      <button type="button" disabled={isLoading} onClick={handleAsk}>
        {isLoading ? 'Обработка...' : 'Анализировать документ'}
      </button>

      {status && <p className="document-status">{status}</p>}
      {answer && <pre className="document-answer">{answer}</pre>}
    </section>
  );
}

function FileBox({
  title,
  doc,
  onFile,
}: {
  title: string;
  doc: ExtractedDocument | null;
  onFile: (file: File | undefined) => void;
}) {
  return (
    <label className="document-file-box">
      <span>{title}</span>
      <input accept=".pdf,.docx,.txt,.md,.csv" type="file" onChange={(event) => onFile(event.target.files?.[0])} />
      {doc && <strong>{doc.name} / {doc.type} / {doc.text.length} символов</strong>}
    </label>
  );
}

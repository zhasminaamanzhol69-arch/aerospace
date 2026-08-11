import { useEffect, useState } from 'react';
import { generateEngineeringReport } from '../lib/aiEngineeringReport';
import type { CalculatedParameters, DesignOption, MissionRequirements } from '../lib/aerospace';
import { useLanguage, type Language } from '../lib/language';
import './AiEngineeringReport.css';

type Props = {
  requirements: MissionRequirements;
  parameters: CalculatedParameters;
  options: DesignOption[];
};

const text: Record<Language, {
  title: string;
  loading: string;
  update: string;
  generate: string;
  failed: string;
  base: string;
  placeholder: string;
  risk: Record<string, string>;
}> = {
  kk: {
    title: 'Есептелген параметрлер бойынша AI қорытынды',
    loading: 'AI талдап жатыр…',
    update: 'Қорытындыны жаңарту',
    generate: 'Қорытынды жасау',
    failed: 'AI-қорытындыны жасау мүмкін болмады.',
    base: 'Қорытынды негізі',
    placeholder: 'Батырманы басыңыз: AI есептелген параметрлерді түсіндіріп, инженерлік шешім мен тәуекелдерді көрсетеді.',
    risk: { Low: 'Төмен', Medium: 'Орташа', High: 'Жоғары' },
  },
  ru: {
    title: 'AI-вывод по рассчитанным параметрам',
    loading: 'AI анализирует…',
    update: 'Обновить вывод',
    generate: 'Сформировать выводы',
    failed: 'AI-отчёт не удалось сформировать.',
    base: 'Основа вывода',
    placeholder: 'Нажми кнопку, и AI объяснит рассчитанные параметры, предложит инженерное решение и покажет риски по текущим Mission Requirements.',
    risk: { Low: 'Low', Medium: 'Medium', High: 'High' },
  },
  en: {
    title: 'AI report based on calculated parameters',
    loading: 'AI is analyzing…',
    update: 'Update report',
    generate: 'Generate report',
    failed: 'Could not generate the AI report.',
    base: 'Report basis',
    placeholder: 'Press the button and AI will explain the calculated parameters, propose an engineering solution, and show risks for the current Mission Requirements.',
    risk: { Low: 'Low', Medium: 'Medium', High: 'High' },
  },
};

export function AiEngineeringReport({ requirements, parameters, options }: Props) {
  const { language } = useLanguage();
  const [report, setReport] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const copy = text[language];
  const best = options[0];

  useEffect(() => {
    setError('');
    setReport('');
  }, [language, parameters, requirements]);

  async function handleGenerate() {
    setIsLoading(true);
    setError('');
    setReport('');

    try {
      const nextReport = await generateEngineeringReport(requirements, parameters, options, language);
      setReport(nextReport);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : copy.failed);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="card ai-report">
      <div className="ai-report__header">
        <div>
          <p className="eyebrow">AI Engineering Report</p>
          <h2>{copy.title}</h2>
        </div>
        <button type="button" onClick={handleGenerate} disabled={isLoading}>
          {isLoading ? copy.loading : report ? copy.update : copy.generate}
        </button>
      </div>

      <div className="ai-report__params">
        <span>{copy.base}: {best.name}</span>
        <strong>{parameters.estimatedTakeoffMassKg} kg</strong>
        <strong>{parameters.requiredPowerW} W</strong>
        <strong>{copy.risk[best.risk]}</strong>
      </div>

      {error && <p className="message">{error}</p>}
      {report ? (
        <p className="ai-report__text">{report}</p>
      ) : (
        <p className="ai-report__placeholder">{copy.placeholder}</p>
      )}
    </section>
  );
}

import { useCallback, useEffect, useState } from 'react';
import { generateEngineeringReport } from '../lib/aiEngineeringReport';
import { aiReportText } from '../lib/aiEngineeringReportText';
import type { CalculatedParameters, DesignOption, MissionRequirements } from '../lib/aerospace';
import type { EngineeringStage } from '../lib/engineeringStage';
import { useLanguage } from '../lib/language';
import { useVoiceDictation } from '../lib/useVoiceDictation';
import './AiEngineeringReport.css';

type Props = {
  stage: EngineeringStage;
  requirements: MissionRequirements;
  parameters: CalculatedParameters;
  options: DesignOption[];
};

export function AiEngineeringReport({ stage, requirements, parameters, options }: Props) {
  const { language } = useLanguage();
  const [question, setQuestion] = useState('');
  const [report, setReport] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const copy = aiReportText[language];
  const best = options[0];
  const appendVoiceText = useCallback((text: string) => {
    setQuestion((current) => `${current}${current ? ' ' : ''}${text}`);
  }, []);
  const voice = useVoiceDictation({
    language,
    onError: setError,
    onFinalText: appendVoiceText,
    unsupportedMessage: copy.voiceUnsupported,
  });

  useEffect(() => {
    setError('');
    setReport('');
  }, [language, parameters, requirements]);

  async function handleGenerate() {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) {
      setError(copy.emptyQuestion);
      return;
    }

    setIsLoading(true);
    setError('');
    setReport('');

    try {
      const nextReport = await generateEngineeringReport(
        requirements,
        parameters,
        options,
        language,
        stage,
        trimmedQuestion,
      );
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
          <p className="eyebrow">{language === 'ru' ? 'ИИ-помощник' : language === 'kk' ? 'AI көмекшісі' : 'AI Assistant'}</p>
          <h2>{copy.title}</h2>
          <p className="ai-report__subtitle">{copy.subtitle}</p>
        </div>
      </div>

      <div className="ai-report__params">
        <span>{copy.base}: {best.name}</span>
        <strong>{parameters.estimatedTakeoffMassKg} kg</strong>
        <strong>{parameters.requiredPowerW} W</strong>
        <strong>{copy.risk[best.risk]}</strong>
      </div>

      <label className="ai-report__input">
        <span>{copy.inputLabel}</span>
        <div className="ai-report__voice-field">
          <textarea
            onChange={(event) => setQuestion(event.target.value)}
            placeholder={copy.inputPlaceholder}
            rows={4}
            value={question}
          />
          <button
            aria-label={voice.isListening ? copy.voiceStop : copy.voiceStart}
            className={voice.isListening ? 'ai-report__voice is-listening' : 'ai-report__voice'}
            disabled={!voice.isSupported}
            onClick={() => {
              setError('');
              voice.toggle();
            }}
            type="button"
          >
            <span aria-hidden="true">●</span>
            {voice.isListening ? copy.voiceStop : copy.voiceStart}
          </button>
        </div>
        {voice.isListening && (
          <p className="ai-report__dictation">
            {voice.interimText || copy.voiceListening}
          </p>
        )}
      </label>

      <button type="button" onClick={handleGenerate} disabled={isLoading}>
        {isLoading ? copy.loading : copy.ask}
      </button>

      {error && <p className="message">{error}</p>}
      {report ? (
        <article className="ai-report__result">
          <p className="ai-report__text">{report}</p>
        </article>
      ) : (
        <p className="ai-report__placeholder">{copy.placeholder}</p>
      )}
    </section>
  );
}

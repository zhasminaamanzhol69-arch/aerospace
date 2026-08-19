import { useState } from 'react';
import { tutorialText } from '../lib/tutorialText';
import { useLanguage } from '../lib/language';
import { TutorialMelodyButton } from './TutorialMelodyButton';
import './TutorialGate.css';
import './TutorialMockScreen.css';
import './TutorialPointButtons.css';

type Props = {
  onContinue: () => void;
};

export function TutorialGate({ onContinue }: Props) {
  const { language } = useLanguage();
  const [stepIndex, setStepIndex] = useState<number | null>(null);
  const [activePoint, setActivePoint] = useState(0);
  const copy = tutorialText[language];

  if (stepIndex !== null) {
    const step = copy.steps[stepIndex];
    const selectedPoint = step.points[activePoint] ?? step.points[0];
    const isLastStep = stepIndex === copy.steps.length - 1;

    return (
      <main className="tutorial-gate">
        <section className="tutorial-panel">
          <div className="tutorial-visual" aria-hidden="true">
            <MockScreen index={stepIndex} label={step.label} />
          </div>
          <div className="tutorial-content">
            <p className="eyebrow">{copy.progress} {stepIndex + 1} / {copy.steps.length}</p>
            <h1>{step.title}</h1>
            <p>{step.body}</p>
            <ul className="tutorial-points">
              {step.points.map((point, index) => (
                <li key={point.title}>
                  <button
                    className={index === activePoint ? 'is-active' : ''}
                    onClick={() => setActivePoint(index)}
                    type="button"
                  >
                    {point.title}
                  </button>
                </li>
              ))}
            </ul>
            <article className="tutorial-explain">
              <strong>{selectedPoint.title}</strong>
              <p>{selectedPoint.detail}</p>
            </article>
            <div className="tutorial-dots" aria-hidden="true">
              {copy.steps.map((item, index) => (
                <span className={index === stepIndex ? 'is-active' : ''} key={item.title} />
              ))}
            </div>
            <div className="tutorial-actions">
              <button
                className="ghost"
                onClick={() => {
                  setActivePoint(0);
                  setStepIndex(Math.max(stepIndex - 1, 0));
                }}
                type="button"
              >
                {copy.back}
              </button>
              <button
                onClick={() => {
                  setActivePoint(0);
                  if (isLastStep) onContinue();
                  else setStepIndex(stepIndex + 1);
                }}
                type="button"
              >
                {isLastStep ? copy.start : copy.next}
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="tutorial-gate">
      <section className="tutorial-choice">
        <div className="tutorial-choice__orbit" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <TutorialMelodyButton />
        <p className="eyebrow">Vectori</p>
        <h1>{copy.title}</h1>
        <p>{copy.subtitle}</p>
        <div className="tutorial-actions tutorial-actions--center">
          <button
            onClick={() => {
              setActivePoint(0);
              setStepIndex(0);
            }}
            type="button"
          >
            {copy.tutorial}
          </button>
          <button className="ghost" onClick={onContinue} type="button">{copy.continue}</button>
        </div>
      </section>
    </main>
  );
}

function MockScreen({ index, label }: { index: number; label: string }) {
  return (
    <div className={`mock-screen mock-screen--${index}`}>
      <span className="mock-screen__header">
        {label}
        <span className="mock-screen__menu-dot" />
      </span>
      <span className="mock-screen__hero" />
      <span className="mock-screen__panel mock-screen__panel--one" />
      <span className="mock-screen__panel mock-screen__panel--two" />
      <span className="mock-screen__cursor" />
    </div>
  );
}

import { useMemo, useState } from 'react';
import { AgentWorkflow } from '../components/AgentWorkflow';
import { AiEngineeringReport } from '../components/AiEngineeringReport';
import { CalculatedParametersPanel } from '../components/CalculatedParametersPanel';
import { DesignRecommendation } from '../components/DesignRecommendation';
import { DigitalTwinPanel } from '../components/DigitalTwinPanel';
import { FaqSection } from '../components/FaqSection';
import { LanguageSelector } from '../components/LanguageSelector';
import { MissionInputForm } from '../components/MissionInputForm';
import {
  buildDesignOptions,
  calculateMissionParameters,
  defaultRequirements,
  type MissionRequirements,
} from '../lib/aerospace';
import { LanguageContext, type Language } from '../lib/language';
import heroImage from '../assets/uav-mission-hero.png';
import './HomePage.css';

const heroText = {
  kk: {
    title: 'AI Agent for Aerospace Design Decisions',
    body: 'Инженерлік агент ұшу және ғарыш аппараттарына қойылатын талаптарды талдайды. Бұл прототипте есеп UAV миссиясы арқылы көрсетілген.',
  },
  ru: {
    title: 'AI Agent for Aerospace Design Decisions',
    body: 'Инженерный агент анализирует требования к летательным и космическим аппаратам. В этом прототипе расчёт показан на примере UAV-миссии.',
  },
  en: {
    title: 'AI Agent for Aerospace Design Decisions',
    body: 'The engineering agent analyzes requirements for aircraft and spacecraft. This prototype demonstrates the calculation with a UAV mission.',
  },
};

export function HomePage() {
  const [language, setLanguage] = useState<Language>('ru');
  const [requirements, setRequirements] = useState<MissionRequirements>(defaultRequirements);
  const parameters = useMemo(() => calculateMissionParameters(requirements), [requirements]);
  const options = useMemo(() => buildDesignOptions(requirements), [requirements]);
  const text = heroText[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <main className="container mission-page">
        <LanguageSelector />
        <section className="mission-hero">
          <div>
            <p className="eyebrow">Aerospace Engineering / Mission Control</p>
            <h1>{text.title}</h1>
            <p>{text.body}</p>
          </div>
          <div className="flight-visual">
            <img src={heroImage} alt="UAV engineering visualization in mission control" />
            <span className="telemetry telemetry--one">ALT 1200m</span>
            <span className="telemetry telemetry--two">BAT 78%</span>
          </div>
        </section>

        <AgentWorkflow />

        <section className="mission-grid">
          <MissionInputForm requirements={requirements} onChange={setRequirements} />
          <CalculatedParametersPanel parameters={parameters} requirements={requirements} />
        </section>

        <section className="mission-grid">
          <DesignRecommendation options={options} />
          <AiEngineeringReport requirements={requirements} parameters={parameters} options={options} />
        </section>

        <DigitalTwinPanel />

        <FaqSection />
      </main>
    </LanguageContext.Provider>
  );
}

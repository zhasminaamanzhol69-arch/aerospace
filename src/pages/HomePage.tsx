import { useMemo, useState } from 'react';
import { AgentWorkflow } from '../components/AgentWorkflow';
import { AiEngineeringReport } from '../components/AiEngineeringReport';
import { CalculatedParametersPanel } from '../components/CalculatedParametersPanel';
import { DesignRecommendation } from '../components/DesignRecommendation';
import { DigitalTwinPanel } from '../components/DigitalTwinPanel';
import { DomainContextPanel } from '../components/DomainContextPanel';
import { FaqSection } from '../components/FaqSection';
import { LanguageSelector } from '../components/LanguageSelector';
import { MissionInputForm } from '../components/MissionInputForm';
import { ProfileMenu } from '../components/ProfileMenu';
import { StageTabs } from '../components/StageTabs';
import { UserGate } from '../components/UserGate';
import { VehicleDomainTabs } from '../components/VehicleDomainTabs';
import {
  buildDesignOptions,
  calculateMissionParameters,
  defaultRequirements,
  type MissionRequirements,
} from '../lib/aerospace';
import type { EngineeringStage } from '../lib/engineeringStage';
import { LanguageContext, type Language } from '../lib/language';
import {
  clearUserProfile,
  loadUserProfile,
  saveUserProfile,
  type UserProfile,
} from '../lib/userProfile';
import aviationHeroImage from '../assets/aviation-domain-hero.png';
import spacecraftHeroImage from '../assets/spacecraft-domain-hero.png';
import './HomePage.css';

const heroText = {
  kk: {
    title: 'AI System for Aerospace Design, Manufacturing & Operational Engineering Decisions',
    body: 'Инженерлік ассистент: ұшу және ғарыш аппараттарын жобалау, дайындау мен пайдалану кезеңдеріндегі нормативтік және техникалық шешімдер.',
  },
  ru: {
    title: 'AI System for Aerospace Design, Manufacturing & Operational Engineering Decisions',
    body: 'Инженерный ассистент: нормативные и технические решения на этапах проектирования, производства и эксплуатации летательных и космических аппаратов.',
  },
  en: {
    title: 'AI System for Aerospace Design, Manufacturing & Operational Engineering Decisions',
    body: 'Engineering assistant for standards-based and technical decisions across design, manufacturing, and operations of aircraft and spacecraft.',
  },
};

export function HomePage() {
  const [language, setLanguage] = useState<Language>('ru');
  const [profile, setProfile] = useState<UserProfile | null>(() => loadUserProfile());
  const [stage, setStage] = useState<EngineeringStage>('design');
  const [requirements, setRequirements] = useState<MissionRequirements>(defaultRequirements);
  const parameters = useMemo(() => calculateMissionParameters(requirements), [requirements]);
  const options = useMemo(() => buildDesignOptions(requirements), [requirements]);
  const text = heroText[language];
  const isSpacecraft = requirements.vehicleDomain === 'spacecraft';

  function handleProfileComplete(nextProfile: UserProfile) {
    saveUserProfile(nextProfile);
    setProfile(nextProfile);
  }

  function handleLogout() {
    clearUserProfile();
    setProfile(null);
  }

  function updateDomain(vehicleDomain: MissionRequirements['vehicleDomain']) {
    setRequirements((current) => ({
      ...current,
      vehicleDomain,
      vehicleScheme: vehicleDomain === 'spacecraft' ? 'cubesat-satellite' : 'fixed-wing',
      environment: vehicleDomain === 'spacecraft' ? 'space' : 'normal',
      energySource: vehicleDomain === 'spacecraft' ? 'solar' : 'li-ion',
      missionMode: vehicleDomain === 'spacecraft' ? 'orbital' : 'waypoint',
      material: vehicleDomain === 'spacecraft' ? 'titanium' : 'carbon',
      manufacturingMethod: vehicleDomain === 'spacecraft' ? 'dmls' : 'autoclave',
      jointMethod: vehicleDomain === 'spacecraft' ? 'welding' : 'adhesive',
    }));
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <main className="container mission-page">
        <div className="top-bar">
          <LanguageSelector />
          {profile && <ProfileMenu profile={profile} onLogout={handleLogout} />}
        </div>
        {!profile ? (
          <UserGate onComplete={handleProfileComplete} />
        ) : (
          <>
        <VehicleDomainTabs value={requirements.vehicleDomain} onChange={updateDomain} />
        <StageTabs value={stage} onChange={setStage} />
        <DomainContextPanel stage={stage} domain={requirements.vehicleDomain} />
        <section className="mission-hero">
          <div>
            <p className="eyebrow">Aerospace Engineering / Mission Control</p>
            <h1>{text.title}</h1>
            <p>{text.body}</p>
          </div>
          <div className="flight-visual">
            <img src={isSpacecraft ? spacecraftHeroImage : aviationHeroImage} alt="Aerospace engineering visualization" />
            <span className="telemetry telemetry--one">{isSpacecraft ? 'ORB LEO' : 'ALT 1200m'}</span>
            <span className="telemetry telemetry--two">{isSpacecraft ? 'SOL 180W' : 'BAT 78%'}</span>
          </div>
        </section>

        <AgentWorkflow stage={stage} domain={requirements.vehicleDomain} />

        <section className="mission-grid">
          <MissionInputForm stage={stage} requirements={requirements} onChange={setRequirements} />
          <CalculatedParametersPanel stage={stage} parameters={parameters} requirements={requirements} />
        </section>

        {stage === 'operations' ? (
          <section className="mission-grid">
            <DigitalTwinPanel parameters={parameters} requirements={requirements} />
            <AiEngineeringReport stage={stage} requirements={requirements} parameters={parameters} options={options} />
          </section>
        ) : (
          <section className="mission-grid">
            <DesignRecommendation stage={stage} options={options} requirements={requirements} />
            <AiEngineeringReport stage={stage} requirements={requirements} parameters={parameters} options={options} />
          </section>
        )}

        <FaqSection />
          </>
        )}
      </main>
    </LanguageContext.Provider>
  );
}

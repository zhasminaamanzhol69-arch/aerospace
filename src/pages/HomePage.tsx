import { useCallback, useMemo, useState } from 'react';
import { AgentWorkflow } from '../components/AgentWorkflow';
import { AiEngineeringReport } from '../components/AiEngineeringReport';
import { CalculatedParametersPanel } from '../components/CalculatedParametersPanel';
import { DesignRecommendation } from '../components/DesignRecommendation';
import { DigitalTwinPanel } from '../components/DigitalTwinPanel';
import { DomainContextPanel } from '../components/DomainContextPanel';
import { EngineeringCalculator } from '../components/EngineeringCalculator';
import { FaqSection } from '../components/FaqSection';
import { HomeQuickActions } from '../components/HomeQuickActions';
import { IntroSplash } from '../components/IntroSplash';
import { LanguageSelector } from '../components/LanguageSelector';
import { MissionInputForm } from '../components/MissionInputForm';
import { ProfileMenu } from '../components/ProfileMenu';
import { SiteMenu } from '../components/SiteMenu';
import { StageEngineeringSuite } from '../components/StageEngineeringSuite';
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
import { useLanguage } from '../lib/language';
import {
  clearUserProfile,
  loadUserProfile,
  saveUserProfile,
  type UserProfile,
} from '../lib/userProfile';
import { heroText } from '../lib/homeText';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { useGoogleAuthProfile } from '../lib/useGoogleAuthProfile';
import aviationHeroImage from '../assets/aviation-domain-hero.png';
import spacecraftHeroImage from '../assets/spacecraft-domain-hero.png';
import './HomePage.css';

export function HomePage() {
  const { language } = useLanguage();
  const initialProfile = useMemo(() => loadUserProfile(), []);
  const [profile, setProfile] = useState<UserProfile | null>(initialProfile);
  const [showIntro, setShowIntro] = useState(true);
  const [stage, setStage] = useState<EngineeringStage>('design');
  const [requirements, setRequirements] = useState<MissionRequirements>(defaultRequirements);
  const parameters = useMemo(() => calculateMissionParameters(requirements), [requirements]);
  const options = useMemo(() => buildDesignOptions(requirements), [requirements]);
  const text = heroText[language];
  const isSpacecraft = requirements.vehicleDomain === 'spacecraft';
  const applyProfile = useCallback((nextProfile: UserProfile) => {
    setProfile(nextProfile);
    setShowIntro(false);
  }, []);
  useGoogleAuthProfile(applyProfile);

  function handleProfileComplete(nextProfile: UserProfile) {
    saveUserProfile(nextProfile);
    setProfile(nextProfile);
    setShowIntro(false);
  }

  async function handleLogout() {
    if (isSupabaseConfigured) await supabase.auth.signOut();
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
    showIntro && !profile ? (
      <IntroSplash onDone={() => setShowIntro(false)} />
    ) : (
      <main className="container mission-page">
        <div className="top-bar">
          {profile && <SiteMenu />}
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

        <HomeQuickActions />

        <AgentWorkflow stage={stage} domain={requirements.vehicleDomain} />

        <section className="mission-grid">
          <MissionInputForm stage={stage} requirements={requirements} onChange={setRequirements} />
          <CalculatedParametersPanel stage={stage} parameters={parameters} requirements={requirements} />
        </section>

        <EngineeringCalculator requirements={requirements} parameters={parameters} />

        <StageEngineeringSuite stage={stage} requirements={requirements} parameters={parameters} options={options} />

        {stage === 'operations' ? (
          <section className="mission-grid" id="ai-agent">
            <DigitalTwinPanel parameters={parameters} requirements={requirements} />
            <AiEngineeringReport stage={stage} requirements={requirements} parameters={parameters} options={options} />
          </section>
        ) : (
          <section className="mission-grid" id="ai-agent">
            <DesignRecommendation stage={stage} options={options} requirements={requirements} />
            <AiEngineeringReport stage={stage} requirements={requirements} parameters={parameters} options={options} />
          </section>
        )}

        <FaqSection />
          </>
        )}
      </main>
    )
  );
}

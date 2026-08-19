import { useCallback, useMemo, useState } from 'react';
import { FaqSection } from '../components/FaqSection';
import { HeroAnimation } from '../components/HeroAnimation';
import { HomeQuickActions } from '../components/HomeQuickActions';
import { IntroSplash } from '../components/IntroSplash';
import { LanguageSelector } from '../components/LanguageSelector';
import { MainEngineeringWorkspace } from '../components/MainEngineeringWorkspace';
import { ProfileMenu } from '../components/ProfileMenu';
import { SiteMenu } from '../components/SiteMenu';
import { TutorialGate } from '../components/TutorialGate';
import { UserGate } from '../components/UserGate';
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
  saveSessionUserProfile,
  saveUserProfile,
  type UserProfile,
} from '../lib/userProfile';
import { heroText } from '../lib/homeText';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { useGoogleAuthProfile } from '../lib/useGoogleAuthProfile';
import './HomePage.css';

const onboardingKey = 'aerospace-onboarding-done';

function hasFinishedOnboarding() {
  return sessionStorage.getItem(onboardingKey) === 'true';
}

function finishOnboarding() {
  sessionStorage.setItem(onboardingKey, 'true');
}

export function HomePage() {
  const { language } = useLanguage();
  const initialProfile = useMemo(() => loadUserProfile(), []);
  const [profile, setProfile] = useState<UserProfile | null>(initialProfile);
  const [showIntro, setShowIntro] = useState(() => !initialProfile && !hasFinishedOnboarding());
  const [showTutorialGate, setShowTutorialGate] = useState(() => !initialProfile && !hasFinishedOnboarding());
  const [stage, setStage] = useState<EngineeringStage>('design');
  const [requirements, setRequirements] = useState<MissionRequirements>(defaultRequirements);
  const parameters = useMemo(() => calculateMissionParameters(requirements), [requirements]);
  const options = useMemo(() => buildDesignOptions(requirements), [requirements]);
  const text = heroText[language];
  const isSpacecraft = requirements.vehicleDomain === 'spacecraft';
  const canReview = Boolean(profile?.email && profile.nickname !== 'guest');
  const applyProfile = useCallback((nextProfile: UserProfile) => {
    setProfile(nextProfile);
    setShowIntro(false);
  }, []);
  useGoogleAuthProfile(applyProfile);

  function handleProfileComplete(nextProfile: UserProfile) {
    if (nextProfile.nickname === 'guest') saveSessionUserProfile(nextProfile);
    else saveUserProfile(nextProfile);
    finishOnboarding();
    setProfile(nextProfile);
    setShowIntro(false);
    setShowTutorialGate(false);
  }

  async function handleLogout() {
    if (isSupabaseConfigured) await supabase.auth.signOut();
    clearUserProfile();
    setProfile(null);
    setShowTutorialGate(true);
  }

  return (
    showIntro ? (
      <IntroSplash onDone={() => setShowIntro(false)} />
    ) : showTutorialGate ? (
      <TutorialGate onContinue={() => {
        finishOnboarding();
        setShowTutorialGate(false);
      }} />
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
        <section className="mission-hero">
          <div>
            <p className="eyebrow">{text.eyebrow}</p>
            <h1>{text.title}</h1>
            <p>{text.body}</p>
          </div>
          <div className="flight-visual">
            <HeroAnimation isSpacecraft={isSpacecraft} label={text.imageAlt} />
            <span className="telemetry telemetry--one">{isSpacecraft ? 'ORB LEO' : 'ALT 1200m'}</span>
            <span className="telemetry telemetry--two">{isSpacecraft ? 'SOL 180W' : 'BAT 78%'}</span>
          </div>
        </section>

        <HomeQuickActions />

        <MainEngineeringWorkspace
          onRequirementsChange={setRequirements}
          onStageChange={setStage}
          options={options}
          parameters={parameters}
          requirements={requirements}
          stage={stage}
        />

        <FaqSection canReview={canReview} />
          </>
        )}
      </main>
    )
  );
}

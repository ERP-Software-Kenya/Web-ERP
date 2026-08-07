import React from 'react';
import { OnboardingProvider, useOnboarding } from './features/onboarding/context/OnboardingContext';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './features/marketing/pages/LandingPage';
import SSOCallback from './features/auth/pages/SSOCallback';
import Step1Account from './features/onboarding/steps/Step1Account';
import Step2OrgSetup from './features/onboarding/steps/Step2OrgSetup';
import Step3BusinessType from './features/onboarding/steps/Step3BusinessType';
import Step4TeamSize from './features/onboarding/steps/Step4TeamSize';
import Step5Modules from './features/onboarding/steps/Step5Modules';
import Step6HowYouSell from './features/onboarding/steps/Step6HowYouSell';
import Step7Pricing from './features/onboarding/steps/Step7Pricing';
import Step8Done from './features/onboarding/steps/Step8Done';

import { ThemeProvider } from './features/theme/context/ThemeContext';

function OnboardingFlow() {
  const { step, direction, goTo } = useOnboarding();

  // Handle OAuth callback route natively
  if (window.location.pathname === '/sso-callback') {
    return <SSOCallback />;
  }

  // Full-screen steps (no split layout handled internally)
  if (step === 0) return <LandingPage />;
  if (step === 7) return <Step7Pricing />;
  if (step === 8) return <Step8Done />;

  return (
    <>
      {/* Exit button — visible on steps 1-6 */}
      {step > 0 && step < 7 && (
        <button
          className="exit-btn"
          style={{ zIndex: 50 }}
          id="btn-exit-onboarding"
          onClick={() => {
            if (window.confirm('Exit onboarding? Your progress will be lost.')) {
              window.location.href = import.meta.env.VITE_CLIENT_URL || 'http://localhost:5173';
            }
          }}
        >
          Exit onboarding
        </button>
      )}

      <AnimatePresence mode="wait" custom={direction}>
        {step === 1 && <Step1Account key="step1" />}
        {step === 2 && <Step2OrgSetup key="step2" />}
        {step === 3 && <Step3BusinessType key="step3" />}
        {step === 4 && <Step4TeamSize key="step4" />}
        {step === 5 && <Step5Modules key="step5" />}
        {step === 6 && <Step6HowYouSell key="step6" />}
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <OnboardingProvider>
        <OnboardingFlow />
      </OnboardingProvider>
    </ThemeProvider>
  );
}

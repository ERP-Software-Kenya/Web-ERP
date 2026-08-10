import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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
  const { step, direction } = useOnboarding();
  const location = useLocation();

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
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/sso-callback" element={<SSOCallback />} />
          <Route path="/onboarding/step-1" element={<Step1Account />} />
          <Route path="/onboarding/step-2" element={<Step2OrgSetup />} />
          <Route path="/onboarding/step-3" element={<Step3BusinessType />} />
          <Route path="/onboarding/step-4" element={<Step4TeamSize />} />
          <Route path="/onboarding/step-5" element={<Step5Modules />} />
          <Route path="/onboarding/step-6" element={<Step6HowYouSell />} />
          <Route path="/onboarding/step-7" element={<Step7Pricing />} />
          <Route path="/onboarding/done" element={<Step8Done />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <OnboardingProvider>
            <OnboardingFlow />
          </OnboardingProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

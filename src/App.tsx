import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OnboardingProvider, useOnboarding } from './features/onboarding/context/OnboardingContext';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './features/marketing/pages/LandingPage';
import DownloadsPage from './features/downloads/pages/DownloadsPage';
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
  const { step, direction, authState, authError, data, refreshAuth } = useOnboarding();
  const location = useLocation();
  const navigate = useNavigate();

  const protectSetup = (content: React.ReactNode, requiredStep: number) => {
    if (authState === 'loading') return <div className="onboarding-loading">Verifying your account…</div>;
    if (authState === 'error') return (
      <div className="onboarding-loading">
        <p>{authError || 'Unable to verify your account.'}</p>
        <button className="btn-primary" onClick={() => void refreshAuth()}>Retry</button>
      </div>
    );
    if (authState === 'signed_out') return <Navigate to="/onboarding/step-1" replace />;
    if (authState === 'complete') return <Navigate to="/onboarding/done" replace />;
    if (requiredStep >= 3 && (!data.orgName || !data.industry || !data.country)) return <Navigate to="/onboarding/step-2" replace />;
    if (requiredStep >= 4 && !data.businessType) return <Navigate to="/onboarding/step-3" replace />;
    if (requiredStep >= 5 && !data.teamSize) return <Navigate to="/onboarding/step-4" replace />;
    if (requiredStep >= 6 && data.modules.length === 0) return <Navigate to="/onboarding/step-5" replace />;
    if (requiredStep >= 7 && !data.salesMethod) return <Navigate to="/onboarding/step-6" replace />;
    return content;
  };

  const accountStep = authState === 'loading'
    ? <div className="onboarding-loading">Loading secure account setup…</div>
    : authState === 'complete'
      ? <Navigate to="/onboarding/done" replace />
      : authState === 'needs_organization'
        ? <Navigate to="/onboarding/step-2" replace />
        : authState === 'error'
          ? (
            <div className="onboarding-loading">
              <p>{authError || 'Unable to verify your account.'}</p>
              <button className="btn-primary" onClick={() => void refreshAuth()}>Retry</button>
            </div>
          )
          : <Step1Account />;

  const completionStep = authState === 'complete'
    ? <Step8Done />
    : authState === 'loading'
      ? <div className="onboarding-loading">Verifying your workspace…</div>
      : <Navigate to={authState === 'signed_out' ? '/onboarding/step-1' : '/onboarding/step-2'} replace />;

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
              navigate('/');
            }
          }}
        >
          Exit onboarding
        </button>
      )}

      <AnimatePresence mode="wait" custom={direction}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/downloads" element={<DownloadsPage />} />
          <Route path="/dashboard" element={<Navigate to="/onboarding/done" replace />} />
          <Route path="/sso-callback" element={<SSOCallback />} />
          <Route path="/onboarding/step-1" element={accountStep} />
          <Route path="/onboarding/step-2" element={protectSetup(<Step2OrgSetup />, 2)} />
          <Route path="/onboarding/step-3" element={protectSetup(<Step3BusinessType />, 3)} />
          <Route path="/onboarding/step-4" element={protectSetup(<Step4TeamSize />, 4)} />
          <Route path="/onboarding/step-5" element={protectSetup(<Step5Modules />, 5)} />
          <Route path="/onboarding/step-6" element={protectSetup(<Step6HowYouSell />, 6)} />
          <Route path="/onboarding/step-7" element={protectSetup(<Step7Pricing />, 7)} />
          <Route path="/onboarding/done" element={completionStep} />
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

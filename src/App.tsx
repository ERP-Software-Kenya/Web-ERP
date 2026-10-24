import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OnboardingProvider, useOnboarding } from './features/onboarding/context/OnboardingContext';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './features/theme/context/ThemeContext';

const LandingPage = lazy(() => import('./features/marketing/pages/LandingPage'));
const DownloadsPage = lazy(() => import('./features/downloads/pages/DownloadsPage'));
const SSOCallback = lazy(() => import('./features/auth/pages/SSOCallback'));
const Step1Account = lazy(() => import('./features/onboarding/steps/Step1Account'));
const Step2OrgSetup = lazy(() => import('./features/onboarding/steps/Step2OrgSetup'));
const Step3BusinessType = lazy(() => import('./features/onboarding/steps/Step3BusinessType'));
const Step4TeamSize = lazy(() => import('./features/onboarding/steps/Step4TeamSize'));
const Step5Modules = lazy(() => import('./features/onboarding/steps/Step5Modules'));
const Step6HowYouSell = lazy(() => import('./features/onboarding/steps/Step6HowYouSell'));
const Step7Pricing = lazy(() => import('./features/onboarding/steps/Step7Pricing'));
const Step8Done = lazy(() => import('./features/onboarding/steps/Step8Done'));
const Dashboard = lazy(() => import('./features/dashboard/pages/Dashboard'));

function PageLoader() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        background: 'var(--color-bg, #0b1120)',
        color: 'var(--color-text, #f8fafc)',
      }}
      aria-label="Loading page"
      role="status"
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: '1.25rem',
          color: '#fff',
          boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
        }}
      >
        P
      </div>
      <div
        style={{
          width: 24,
          height: 24,
          border: '3px solid rgba(16, 185, 129, 0.2)',
          borderTopColor: '#10b981',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
    </div>
  );
}

function RequireOnboardingDraft({ children }: { children: React.ReactElement }) {
  const { data, isSignedIn } = useOnboarding();
  if (!data.email && !isSignedIn) {
    return <Navigate to="/onboarding/step-1" replace />;
  }
  return children;
}

function OnboardingFlow() {
  const { step, direction } = useOnboarding();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Suspense fallback={<PageLoader />}>
        <AnimatePresence mode="wait" custom={direction}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/downloads" element={<DownloadsPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/sso-callback" element={<SSOCallback />} />
            <Route path="/onboarding/step-1" element={<Step1Account />} />
            <Route path="/onboarding/step-2" element={<RequireOnboardingDraft><Step2OrgSetup /></RequireOnboardingDraft>} />
            <Route path="/onboarding/step-3" element={<RequireOnboardingDraft><Step3BusinessType /></RequireOnboardingDraft>} />
            <Route path="/onboarding/step-4" element={<RequireOnboardingDraft><Step4TeamSize /></RequireOnboardingDraft>} />
            <Route path="/onboarding/step-5" element={<RequireOnboardingDraft><Step5Modules /></RequireOnboardingDraft>} />
            <Route path="/onboarding/step-6" element={<RequireOnboardingDraft><Step6HowYouSell /></RequireOnboardingDraft>} />
            <Route path="/onboarding/step-7" element={<RequireOnboardingDraft><Step7Pricing /></RequireOnboardingDraft>} />
            <Route path="/onboarding/done" element={<RequireOnboardingDraft><Step8Done /></RequireOnboardingDraft>} />
            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
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

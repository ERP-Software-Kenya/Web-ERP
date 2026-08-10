import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Clerk } from '@clerk/clerk-js';
import type { OnboardingData } from '../../../types';

const defaultData: OnboardingData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  orgName: '',
  industry: '',
  country: '',
  businessType: '',
  teamSize: '',
  modules: [],
  salesMethod: '',
  plan: '',
  billing: 'monthly',
};

const STORAGE_KEY = 'onboarding_data';

interface OnboardingContextType {
  data: OnboardingData;
  setData: (updates: Partial<OnboardingData>) => void;
  clerk: Clerk | null;
  setClerk: (c: Clerk | null) => void;
  isClerkLoaded: boolean;
  isSignedIn: boolean;
  step: number;
  totalSteps: number;
  direction: number;
  goNext: () => void;
  goBack: () => void;
  goTo: (step: number) => void;
}

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export const stepToPath = (step: number) => {
  if (step === 0) return '/';
  if (step === 7) return '/onboarding/step-7'; // Pricing
  if (step === 8) return '/onboarding/done'; // Done
  return `/onboarding/step-${step}`;
};

export const pathToStep = (pathname: string) => {
  if (pathname === '/') return 0;
  if (pathname === '/onboarding/done') return 8;
  const match = pathname.match(/\/onboarding\/step-(\d)/);
  if (match) return parseInt(match[1], 10);
  return 0; // Default or 404
};

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentStep = pathToStep(location.pathname);
  const [direction, setDirection] = useState(0);

  const [data, setDataState] = useState<OnboardingData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultData;
    } catch {
      return defaultData;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const [clerk, setClerk] = useState<Clerk | null>(null);
  const [isClerkLoaded, setIsClerkLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const totalSteps = 8;

  useEffect(() => {
    let mounted = true;
    const initClerk = async () => {
      try {
        const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string;
        if (!CLERK_KEY) return;
        const clerkInstance = new Clerk(CLERK_KEY);
        await clerkInstance.load();
        if (!mounted) return;
        setClerk(clerkInstance);
        setIsClerkLoaded(true);
        if (clerkInstance.session) {
          setIsSignedIn(true);
        }
      } catch (e) {
        console.error('Clerk load error', e);
        if (mounted) setIsClerkLoaded(true);
      }
    };
    initClerk();
    return () => { mounted = false; };
  }, []);

  const setData = (updates: Partial<OnboardingData>) => {
    setDataState((prev: OnboardingData) => ({ ...prev, ...updates }));
  };

  const goNext = () => {
    setDirection(1);
    const nextStep = Math.min(currentStep + 1, totalSteps);
    navigate(stepToPath(nextStep));
  };
  
  const goBack = () => {
    setDirection(-1);
    const prevStep = Math.max(currentStep - 1, 0);
    navigate(stepToPath(prevStep));
  };
  
  const goTo = (s: number) => {
    setDirection(s > currentStep ? 1 : -1);
    navigate(stepToPath(s));
  };

  return (
    <OnboardingContext.Provider value={{ data, setData, clerk, setClerk, isClerkLoaded, isSignedIn, step: currentStep, totalSteps, direction, goNext, goBack, goTo }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used inside OnboardingProvider');
  return ctx;
}

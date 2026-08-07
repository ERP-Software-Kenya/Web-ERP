import React, { createContext, useContext, useState, ReactNode } from 'react';
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

interface OnboardingContextType {
  data: OnboardingData;
  setData: (updates: Partial<OnboardingData>) => void;
  clerk: any;
  setClerk: (c: any) => void;
  step: number;
  totalSteps: number;
  direction: number;
  goNext: () => void;
  goBack: () => void;
  goTo: (step: number) => void;
}

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<OnboardingData>(defaultData);
  const [clerk, setClerk] = useState<any>(null);
  const [step, setStep] = useState(0); // 0 = Landing Page, 1 = Account setup
  const [direction, setDirection] = useState(0);
  const totalSteps = 8;

  const setData = (updates: Partial<OnboardingData>) => {
    setDataState((prev: OnboardingData) => ({ ...prev, ...updates }));
  };

  const goNext = () => {
    setDirection(1);
    setStep(s => Math.min(s + 1, totalSteps));
  };
  
  const goBack = () => {
    setDirection(-1);
    setStep(s => Math.max(s - 1, 0));
  };
  
  const goTo = (s: number) => {
    setDirection(s > step ? 1 : -1);
    setStep(s);
  };

  return (
    <OnboardingContext.Provider value={{ data, setData, clerk, setClerk, step, totalSteps, direction, goNext, goBack, goTo }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used inside OnboardingProvider');
  return ctx;
}

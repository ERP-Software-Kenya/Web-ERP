import React from 'react';
import { Check } from 'lucide-react';
import { useOnboarding } from '../context/OnboardingContext';

const steps = [
  'Account',
  'Organization',
  'Business',
  'Team',
  'Modules',
  'Sales',
  'Plan',
];

export default function ProgressBar() {
  const { step } = useOnboarding();
  const activeStep = Math.min(Math.max(step, 1), steps.length);

  if (step <= 0 || step > steps.length) return null;

  return (
    <div className="onboarding-stepper" aria-label="Onboarding progress">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isComplete = stepNumber < activeStep;
        const isActive = stepNumber === activeStep;

        return (
          <div
            className={`onboarding-stepper-item${isActive ? ' active' : ''}${isComplete ? ' complete' : ''}`}
            key={label}
          >
            <div className="onboarding-stepper-marker">
              {isComplete ? <Check size={13} /> : stepNumber}
            </div>
            <span>{label}</span>
          </div>
        );
      })}
    </div>
  );
}

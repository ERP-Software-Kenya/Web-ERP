import React from 'react';
import { Check } from 'lucide-react';
import { useOnboarding } from '../context/OnboardingContext';

const STEPS = [
  { id: 1, label: 'Account' },
  { id: 2, label: 'Organization' },
  { id: 3, label: 'Business Type' },
  { id: 4, label: 'Team Size' },
  { id: 5, label: 'Modules' },
  { id: 6, label: 'Sales Channels' },
  { id: 7, label: 'Plan & Billing' },
];

export default function ProgressBar() {
  const { step, goTo } = useOnboarding();
  const activeStep = Math.min(Math.max(step, 1), STEPS.length);

  if (step <= 0 || step > STEPS.length) return null;

  const currentStepObj = STEPS[activeStep - 1];

  return (
    <nav className="onboarding-stepper-wrap" aria-label="Onboarding Progress">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-primary)' }}>
          Step {activeStep} of {STEPS.length}
        </span>
        <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>
          {currentStepObj.label}
        </span>
      </div>

      <ol className="onboarding-stepper-track" style={{ listStyle: 'none', display: 'flex', gap: 6, padding: 0, margin: 0 }}>
        {STEPS.map((s, index) => {
          const stepNumber = index + 1;
          const isComplete = stepNumber < activeStep;
          const isActive = stepNumber === activeStep;

          return (
            <li
              key={s.id}
              style={{ flex: 1 }}
              aria-current={isActive ? 'step' : undefined}
            >
              <button
                type="button"
                onClick={() => {
                  if (stepNumber < activeStep) goTo(stepNumber);
                }}
                disabled={stepNumber > activeStep}
                aria-label={`Step ${stepNumber}: ${s.label}${isComplete ? ' (Completed)' : isActive ? ' (Current)' : ''}`}
                style={{
                  width: '100%',
                  height: 6,
                  borderRadius: 3,
                  border: 'none',
                  padding: 0,
                  cursor: isComplete ? 'pointer' : 'default',
                  background: isComplete
                    ? 'var(--color-success)'
                    : isActive
                    ? 'var(--color-primary)'
                    : 'var(--color-border)',
                  transition: 'background 0.25s ease',
                }}
              />
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

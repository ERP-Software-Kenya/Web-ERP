import React, { useState } from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import { Check } from 'lucide-react';
import StepLayout from '../components/StepLayout';
import type { TeamSize } from '../../../types';

const OPTIONS: TeamSize[] = ['Just me', '2–10', '11–50', '51–200', '200+'];

export default function Step4TeamSize() {
  const { data, setData, goNext, goBack } = useOnboarding();
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!data.teamSize) {
      setError('Please select your team size');
      return;
    }
    goNext();
  };

  const handleSelect = (size: TeamSize) => {
    setData({ teamSize: size });
    setError('');
  };

  return (
    <StepLayout
      title="How big is your team?"
      subtitle="This helps us configure user roles and permissions correctly."
      onContinue={handleContinue}
      onBack={goBack}
    >
      <div className="form-col">
        {OPTIONS.map(size => {
          const isSelected = data.teamSize === size;
          return (
            <button
              key={size}
              onClick={() => handleSelect(size)}
              className={`custom-option-card custom-option-card-between ${isSelected ? 'selected' : ''}`}
            >
              {size}
              {isSelected && (
                <Check size={24} color="var(--color-primary)" strokeWidth={2} />
              )}
            </button>
          );
        })}
      </div>
      {error && <div className="form-error custom-form-error">{error}</div>}
    </StepLayout>
  );
}

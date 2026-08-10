import React, { useState } from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import { Check } from 'lucide-react';
import StepLayout from '../components/StepLayout';
import type { SalesMethod } from '../../../types';

const OPTIONS: { method: SalesMethod; icon: string; desc: string }[] = [
  { method: 'In-store / POS', icon: '🏪', desc: 'Physical retail location' },
  { method: 'Online', icon: '🛒', desc: 'E-commerce website or marketplace' },
  { method: 'Both (In-store + Online)', icon: '🔄', desc: 'Omnichannel retail' },
  { method: 'B2B Sales', icon: '🤝', desc: 'Direct sales to other businesses' },
];

export default function Step6HowYouSell() {
  const { data, setData, goNext, goBack } = useOnboarding();
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!data.salesMethod) {
      setError('Please select how you sell');
      return;
    }
    goNext();
  };

  const handleSelect = (method: SalesMethod) => {
    setData({ salesMethod: method });
    setError('');
  };

  return (
    <StepLayout
      title="How do you sell?"
      subtitle="We'll set up your sales channels accordingly."
      onContinue={handleContinue}
      onBack={goBack}
    >
      <div className="form-col">
        {OPTIONS.map(opt => {
          const isSelected = data.salesMethod === opt.method;
          return (
            <button
              key={opt.method}
              onClick={() => handleSelect(opt.method)}
              className={`custom-option-card ${isSelected ? 'selected' : ''}`}
            >
              <div className="custom-option-icon">{opt.icon}</div>
              <div style={{ flex: 1 }}>
                <div className="custom-option-title">
                  {opt.method}
                </div>
                <div className="custom-option-desc">
                  {opt.desc}
                </div>
              </div>
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

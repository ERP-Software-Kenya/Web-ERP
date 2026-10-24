import React, { useState } from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import { Check, Users } from 'lucide-react';
import StepLayout from '../components/StepLayout';
import type { TeamSize } from '../../../types';

interface TeamOption {
  size: TeamSize;
  title: string;
  desc: string;
}

const OPTIONS: TeamOption[] = [
  { size: 'Just me', title: 'Solo Owner / Operator', desc: 'Single counter operator & workspace admin' },
  { size: '2–10', title: 'Small Shop or Boutique Team', desc: 'Cashiers, storekeeper & owner' },
  { size: '11–50', title: 'Growing Branch / Store', desc: 'Multiple counters, accounts, warehouse & procurement' },
  { size: '51–200', title: 'Multi-Branch Commercial Enterprise', desc: 'Branch managers, supervisors & regional staff' },
  { size: '200+', title: 'Regional Distribution Network', desc: 'Large distributed workforce & enterprise security' },
];

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
      title="How many team members need access?"
      subtitle="We will set up role-based branch permissions and audit controls."
      onContinue={handleContinue}
      onBack={goBack}
    >
      <div role="radiogroup" aria-label="Team size" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {OPTIONS.map((item) => {
          const isSelected = data.teamSize === item.size;

          return (
            <button
              type="button"
              key={item.size}
              role="radio"
              aria-checked={isSelected}
              onClick={() => handleSelect(item.size)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderRadius: '12px',
                border: `1.5px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                background: isSelected ? 'var(--color-primary-glow)' : 'var(--color-surface)',
                color: 'var(--color-text)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: isSelected ? 'var(--color-primary)' : 'var(--color-text)' }}>
                    {item.size}
                  </span>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>· {item.title}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                  {item.desc}
                </div>
              </div>

              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  border: `1.5px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  background: isSelected ? 'var(--color-primary)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginLeft: 12,
                }}
              >
                {isSelected && <Check size={14} color="#ffffff" strokeWidth={3} />}
              </div>
            </button>
          );
        })}
      </div>

      {error && (
        <div className="form-error" role="alert" style={{ marginTop: '16px' }}>
          {error}
        </div>
      )}
    </StepLayout>
  );
}

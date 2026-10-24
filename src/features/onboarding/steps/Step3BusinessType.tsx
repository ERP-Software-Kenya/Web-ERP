import React, { useState } from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import StepLayout from '../components/StepLayout';
import type { BusinessType } from '../../../types';
import { Store, Boxes, Factory, Briefcase, Globe, Sparkles, Check } from 'lucide-react';

const OPTIONS: { type: BusinessType; desc: string; icon: React.ElementType }[] = [
  { type: 'Retail', desc: 'Counter sales, barcode POS & direct consumers', icon: Store },
  { type: 'Wholesale', desc: 'Bulk supply, credit sales & distributor pricing', icon: Boxes },
  { type: 'Manufacturing', desc: 'Raw material procurement, production & conversion', icon: Factory },
  { type: 'Services', desc: 'Invoicing, service jobs & client billing', icon: Briefcase },
  { type: 'E-commerce', desc: 'Digital store orders, delivery & dispatch', icon: Globe },
  { type: 'Other', desc: 'Multi-model enterprise trading operations', icon: Sparkles },
];

export default function Step3BusinessType() {
  const { data, setData, goNext, goBack } = useOnboarding();
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!data.businessType) {
      setError('Please select your business type to proceed');
      return;
    }
    goNext();
  };

  const handleSelect = (type: BusinessType) => {
    setData({ businessType: type });
    setError('');
  };

  return (
    <StepLayout
      title="What is your business model?"
      subtitle="Pramukh Digital ERP will configure transaction workflows and ledgers accordingly."
      onContinue={handleContinue}
      onBack={goBack}
    >
      <div
        role="radiogroup"
        aria-label="Core business model"
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '4px' }}
      >
        {OPTIONS.map((opt) => {
          const isSelected = data.businessType === opt.type;
          const IconComponent = opt.icon;

          return (
            <button
              type="button"
              key={opt.type}
              role="radio"
              aria-checked={isSelected}
              onClick={() => handleSelect(opt.type)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                textAlign: 'left',
                padding: '16px',
                border: `1.5px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                borderRadius: '12px',
                background: isSelected ? 'var(--color-primary-glow)' : 'var(--color-surface)',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.2s ease',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: isSelected ? 'var(--color-primary)' : 'var(--color-surface-2)',
                    color: isSelected ? '#ffffff' : 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <IconComponent size={20} />
                </div>
                {isSelected && (
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: 'var(--color-primary)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Check size={14} strokeWidth={3} />
                  </div>
                )}
              </div>

              <span
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: isSelected ? 'var(--color-primary)' : 'var(--color-text)',
                  marginBottom: '4px',
                }}
              >
                {opt.type}
              </span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', lineHeight: 1.35 }}>
                {opt.desc}
              </span>
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

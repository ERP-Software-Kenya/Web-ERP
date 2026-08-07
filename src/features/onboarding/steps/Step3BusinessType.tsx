import React, { useState } from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import StepLayout from '../components/StepLayout';
import type { BusinessType } from '../../../types';

const OPTIONS: { type: BusinessType; desc: string; icon: string }[] = [
  { type: 'Retail', desc: 'Selling products directly to consumers', icon: '🛍️' },
  { type: 'Wholesale', desc: 'Selling in bulk to other businesses', icon: '📦' },
  { type: 'Manufacturing', desc: 'Producing goods from raw materials', icon: '🏭' },
  { type: 'Services', desc: 'Providing professional services', icon: '🤝' },
  { type: 'E-commerce', desc: 'Online sales and fulfillment', icon: '🌐' },
  { type: 'Other', desc: 'Different business model', icon: '✨' },
];

export default function Step3BusinessType() {
  const { data, setData, goNext, goBack } = useOnboarding();
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!data.businessType) {
      setError('Please select a business type');
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
      title="What's your core business?"
      subtitle="We'll tailor the ERP modules based on your operational focus."
      onContinue={handleContinue}
      onBack={goBack}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '8px' }}>
        {OPTIONS.map(opt => {
          const isSelected = data.businessType === opt.type;
          return (
            <div
              key={opt.type}
              onClick={() => handleSelect(opt.type)}
              style={{
                padding: '16px',
                border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                borderRadius: '12px',
                background: isSelected ? 'var(--color-primary-glow)' : 'var(--color-surface)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '12px' }}>{opt.icon}</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '4px' }}>
                {opt.type}
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                {opt.desc}
              </p>
            </div>
          );
        })}
      </div>
      {error && <div className="form-error" style={{ marginTop: '16px' }}>{error}</div>}
    </StepLayout>
  );
}

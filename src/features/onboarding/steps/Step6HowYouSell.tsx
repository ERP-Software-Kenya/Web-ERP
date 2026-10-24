import React, { useState } from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import { Check, Store, Globe, Layers, Building2 } from 'lucide-react';
import StepLayout from '../components/StepLayout';
import type { SalesMethod } from '../../../types';

const OPTIONS: { method: SalesMethod; title: string; desc: string; icon: React.ElementType }[] = [
  {
    method: 'In-store / POS',
    title: 'Physical Counter / Retail Stores',
    desc: 'Cashiers, fast thermal receipt printing, barcode scanning & cash drawer',
    icon: Store,
  },
  {
    method: 'Online',
    title: 'E-commerce & Web Orders',
    desc: 'Website orders, dispatch notes & courier integration',
    icon: Globe,
  },
  {
    method: 'Both (In-store + Online)',
    title: 'Omnichannel (Retail Stores + Online)',
    desc: 'Unified inventory across storefronts and digital orders',
    icon: Layers,
  },
  {
    method: 'B2B Sales',
    title: 'Wholesale & Field B2B Sales',
    desc: 'Quotations, proforma invoices, credit limits & territory reps',
    icon: Building2,
  },
];

export default function Step6HowYouSell() {
  const { data, setData, goNext, goBack } = useOnboarding();
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!data.salesMethod) {
      setError('Please select how your business sells');
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
      title="How do you sell to customers?"
      subtitle="Pramukh Digital ERP will configure your billing interfaces and stock deduction rules."
      onContinue={handleContinue}
      onBack={goBack}
    >
      <div role="radiogroup" aria-label="Sales channels" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {OPTIONS.map((opt) => {
          const isSelected = data.salesMethod === opt.method;
          const IconComponent = opt.icon;

          return (
            <button
              type="button"
              key={opt.method}
              role="radio"
              aria-checked={isSelected}
              onClick={() => handleSelect(opt.method)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '14px 16px',
                borderRadius: '12px',
                border: `1.5px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                background: isSelected ? 'var(--color-primary-glow)' : 'var(--color-surface)',
                color: 'var(--color-text)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
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
                  marginRight: 14,
                  flexShrink: 0,
                }}
              >
                <IconComponent size={18} />
              </div>

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    color: isSelected ? 'var(--color-primary)' : 'var(--color-text)',
                  }}
                >
                  {opt.title}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                  {opt.desc}
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

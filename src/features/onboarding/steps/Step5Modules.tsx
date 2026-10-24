import React, { useState } from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import StepLayout from '../components/StepLayout';
import { ShoppingCart, Truck, Boxes, BarChart3, FileSpreadsheet, ClipboardCheck, Check } from 'lucide-react';

const MODULES = [
  { id: 'sales', name: 'Sales & POS Billing', desc: 'Cash/credit billing, customer ledgers & receipts', icon: ShoppingCart },
  { id: 'purchasing', name: 'Purchase & Suppliers', desc: 'Supplier orders, receiving & stock allocation', icon: Truck },
  { id: 'inventory', name: 'Inventory & Stock Control', desc: 'Multi-store quantities, batch tracking & valuation', icon: Boxes },
  { id: 'analytics', name: 'Branch Analytics', desc: 'Daily revenue, margin & store metrics', icon: BarChart3 },
  { id: 'reports', name: 'Financial Reports', desc: 'Audit trails, PDF statements & tax exports', icon: FileSpreadsheet },
  { id: 'approvals', name: 'Manager Approvals', desc: 'Role-based authorization for discounts & credit', icon: ClipboardCheck },
];

export default function Step5Modules() {
  const { data, setData, goNext, goBack } = useOnboarding();
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (data.modules.length === 0) {
      setError('Please select at least one module to configure your workspace');
      return;
    }
    goNext();
  };

  const toggleModule = (id: string) => {
    let nextModules = [...data.modules];
    if (nextModules.includes(id)) {
      nextModules = nextModules.filter((m) => m !== id);
    } else {
      nextModules.push(id);
    }
    setData({ modules: nextModules });
    if (nextModules.length > 0) setError('');
  };

  return (
    <StepLayout
      title="Select initial modules"
      subtitle="Choose the operational workflows your branches will begin with."
      onContinue={handleContinue}
      onBack={goBack}
    >
      <div
        role="group"
        aria-label="ERP modules selection"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          marginTop: '4px',
        }}
      >
        {MODULES.map((m) => {
          const isSelected = data.modules.includes(m.id);
          const Icon = m.icon;

          return (
            <button
              type="button"
              key={m.id}
              role="checkbox"
              aria-checked={isSelected}
              onClick={() => toggleModule(m.id)}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  toggleModule(m.id);
                }
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                textAlign: 'left',
                padding: '12px 14px',
                borderRadius: '10px',
                border: `1.5px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                background: isSelected ? 'var(--color-primary-glow)' : 'var(--color-surface)',
                color: 'var(--color-text)',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.18s ease',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  marginBottom: 6,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 6,
                    background: isSelected ? 'var(--color-primary)' : 'var(--color-surface-2)',
                    color: isSelected ? '#ffffff' : 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={17} />
                </div>

                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 4,
                    border: `1.5px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    background: isSelected ? 'var(--color-primary)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {isSelected && <Check size={12} color="#ffffff" strokeWidth={3} />}
                </div>
              </div>

              <div
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: isSelected ? 'var(--color-primary)' : 'var(--color-text)',
                  marginBottom: 2,
                }}
              >
                {m.name}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', lineHeight: 1.3 }}>
                {m.desc}
              </div>
            </button>
          );
        })}
      </div>

      {error && (
        <div className="form-error" role="alert" style={{ marginTop: '14px' }}>
          {error}
        </div>
      )}
    </StepLayout>
  );
}

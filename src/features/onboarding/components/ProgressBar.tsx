import React from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const STEP_LABELS = ['Account', 'Workspace', 'Business', 'Team', 'Modules', 'Sales'];

export default function ProgressBar() {
  const { step } = useOnboarding();
  const showBar = step > 0 && step < 7;
  if (!showBar) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      {STEP_LABELS.map((label, idx) => {
        const stepNum = idx + 1;
        const isDone = step > stepNum;
        const isCurrent = step === stepNum;
        return (
          <React.Fragment key={label}>
            <div
              title={label}
              style={{
                position: 'relative',
                width: isCurrent ? 28 : 22,
                height: isCurrent ? 28 : 22,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                background: isDone || isCurrent
                  ? 'var(--color-primary)'
                  : 'var(--color-surface-3)',
                border: isCurrent
                  ? '2px solid var(--color-primary)'
                  : isDone
                    ? 'none'
                    : '1.5px solid var(--color-border)',
                boxShadow: isCurrent ? '0 0 0 3px var(--color-primary-glow)' : 'none',
              }}
            >
              {isDone ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <Check size={12} color="#fff" strokeWidth={3} />
                </motion.div>
              ) : (
                <span
                  style={{
                    fontSize: isCurrent ? '0.6875rem' : '0.625rem',
                    fontWeight: 700,
                    color: isCurrent ? '#fff' : 'var(--color-text-muted)',
                    lineHeight: 1,
                    transition: 'all 0.3s',
                    userSelect: 'none',
                  }}
                >
                  {stepNum}
                </span>
              )}
            </div>
            {idx < STEP_LABELS.length - 1 && (
              <div
                style={{
                  height: 2,
                  width: 12,
                  borderRadius: 1,
                  background: step > stepNum ? 'var(--color-primary)' : 'var(--color-surface-3)',
                  transition: 'background 0.4s ease',
                  flexShrink: 0,
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

import React from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import { motion } from 'framer-motion';

export default function ProgressBar() {
  const { step } = useOnboarding();
  // Steps 7 (pricing) is full-width, so we only show bar for steps 1-6
  const showBar = step > 0 && step < 7;
  if (!showBar) return null;

  const barSteps = 6;
  
  return (
    <div style={{ width: '100%', maxWidth: '200px', height: '6px', background: 'var(--color-surface-3)', borderRadius: '9999px', overflow: 'hidden' }}>
      <motion.div
        style={{ height: '100%', background: 'var(--color-primary)', borderRadius: '9999px' }}
        initial={{ width: '0%' }}
        animate={{ width: `${(step / barSteps) * 100}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </div>
  );
}

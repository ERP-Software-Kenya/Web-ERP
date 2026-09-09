import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import ProgressBar from './ProgressBar';
import ERPDashboardPreview from '../../preview/components/ERPDashboardPreview';
import ThemeToggle from '../../theme/components/ThemeToggle';
import { useOnboarding } from '../context/OnboardingContext';

interface StepLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  onContinue: () => void;
  onBack?: () => void;
  continueLabel?: string;
  isContinueDisabled?: boolean;
  isLoading?: boolean;
  previewOrgName?: string;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
  }),
};

export default function StepLayout({
  title,
  subtitle,
  children,
  onContinue,
  onBack,
  continueLabel = 'Continue',
  isContinueDisabled = false,
  isLoading = false,
  previewOrgName,
}: StepLayoutProps) {
  const { data, direction, step } = useOnboarding();
  const displayOrgName = previewOrgName || data.orgName || 'Nexus Innovations';
  const userName = [data.firstName, data.lastName].filter(Boolean).join(' ') || 'Workspace Admin';

  return (
    <motion.div 
      className="onboarding-shell"
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Left */}
      <div className="left-panel">
        <div className="left-panel-inner">
          <div className="onboarding-top-row">
            <ProgressBar />
            <ThemeToggle />
          </div>
          
          <div className="step-content">
            <h1 className="step-title">{title}</h1>
            <p className="step-subtitle">{subtitle}</p>

            {children}

            <div className="btn-actions" style={{ marginTop: '32px' }}>
              <motion.button 
                whileHover={!isContinueDisabled && !isLoading ? { scale: 1.02 } : {}}
                whileTap={!isContinueDisabled && !isLoading ? { scale: 0.98 } : {}}
                id="btn-continue" 
                className={`btn-primary${isLoading ? ' loading' : ''}`} 
                onClick={onContinue}
                disabled={isContinueDisabled || isLoading}
              >
                {isLoading ? '' : continueLabel}
              </motion.button>
              {onBack && (
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-secondary" 
                  onClick={onBack}
                >
                  Back
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right — Live ERP Preview */}
      <div className="right-panel">
        <ERPDashboardPreview orgName={displayOrgName} activeModules={data.modules} currentStep={step} userName={userName} />
      </div>
    </motion.div>
  );
}

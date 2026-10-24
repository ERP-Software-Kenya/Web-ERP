import React, { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProgressBar from './ProgressBar';
import ERPDashboardPreview from '../../preview/components/ERPDashboardPreview';
import ThemeToggle from '../../theme/components/ThemeToggle';
import { useOnboarding } from '../context/OnboardingContext';
import { Eye, LayoutDashboard, Sliders } from 'lucide-react';

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
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 60 : -60,
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
  const navigate = useNavigate();
  const [mobileView, setMobileView] = useState<'form' | 'preview'>('form');
  const displayOrgName = previewOrgName || data.orgName || 'Pramukh Digital ERP';
  const userName = [data.firstName, data.lastName].filter(Boolean).join(' ') || 'Admin';

  return (
    <motion.div
      className="onboarding-shell"
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ type: 'spring', stiffness: 320, damping: 32 }}
    >
      {/* Mobile view switcher tab (hidden on desktop >= 1100px via CSS) */}
      <div className="onboarding-mobile-switch">
        <button
          type="button"
          className={`onboarding-tab-btn ${mobileView === 'form' ? 'active' : ''}`}
          onClick={() => setMobileView('form')}
        >
          <Sliders size={15} />
          <span>Setup Form</span>
        </button>
        <button
          type="button"
          className={`onboarding-tab-btn ${mobileView === 'preview' ? 'active' : ''}`}
          onClick={() => setMobileView('preview')}
        >
          <LayoutDashboard size={15} />
          <span>Live Preview</span>
        </button>
      </div>

      {/* Left panel - Form */}
      <div className={`left-panel ${mobileView === 'preview' ? 'mobile-hidden' : ''}`}>
        <div className="left-panel-inner">
          <div className="onboarding-top-row">
            <div style={{ flex: 1, marginRight: 16 }}>
              <ProgressBar />
            </div>
            <ThemeToggle />
          </div>

          <div className="step-content">
            <h1 className="step-title">{title}</h1>
            <p className="step-subtitle">{subtitle}</p>

            {children}

            <div className="btn-actions" style={{ marginTop: 'auto', paddingTop: '28px' }}>
              <motion.button
                whileHover={!isContinueDisabled && !isLoading ? { scale: 1.01 } : {}}
                whileTap={!isContinueDisabled && !isLoading ? { scale: 0.99 } : {}}
                id="btn-continue"
                type="button"
                className={`btn-primary${isLoading ? ' loading' : ''}`}
                onClick={onContinue}
                disabled={isContinueDisabled || isLoading}
                aria-busy={isLoading}
              >
                {isLoading ? '' : continueLabel}
              </motion.button>
              {onBack && (
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="button"
                  className="btn-secondary"
                  onClick={onBack}
                >
                  Back
                </motion.button>
              )}
              {step > 1 && step < 7 && (
                <button
                  type="button"
                  className="btn-exit-link"
                  id="btn-exit-onboarding"
                  onClick={() => {
                    if (window.confirm('Exit onboarding? Your progress will be lost.')) {
                      navigate('/');
                    }
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-text-muted)',
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    marginTop: 8,
                    textAlign: 'center',
                    padding: '4px',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-error, #ef4444)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                >
                  Exit onboarding
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right — Live ERP Preview */}
      <div className={`right-panel ${mobileView === 'form' ? 'mobile-hidden' : ''}`} aria-hidden="true">
        <ERPDashboardPreview
          orgName={displayOrgName}
          activeModules={data.modules}
          currentStep={step}
          userName={userName}
        />
      </div>
    </motion.div>
  );
}

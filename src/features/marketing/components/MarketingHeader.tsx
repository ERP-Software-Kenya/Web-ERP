import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, Globe } from 'lucide-react';
import { useOnboarding } from '../../onboarding/context/OnboardingContext';

export default function MarketingHeader() {
  const { goNext } = useOnboarding();
  const navigate = useNavigate();


  return (
    <header className="marketing-header">
      <div className="marketing-header-container">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="marketing-logo"
        >
          <div className="marketing-logo-icon">W</div>
          <span>Web-ERP</span>
        </motion.div>

        {/* Center Nav */}
        <nav className="marketing-nav">
          <div className="marketing-nav-item">
            <span>Products</span>
            <ChevronDown size={14} className="marketing-nav-chevron" />
          </div>
          <div className="marketing-nav-item">
            <span>Solutions</span>
            <ChevronDown size={14} className="marketing-nav-chevron" />
          </div>
          <div className="marketing-nav-item">
            <span>Resources</span>
            <ChevronDown size={14} className="marketing-nav-chevron" />
          </div>
          <div className="marketing-nav-item">
            <span>Pricing</span>
          </div>
        </nav>

        {/* Right Actions */}
        <div className="marketing-actions">
          <div className="marketing-nav-item" style={{ marginRight: '12px' }}>
            <Globe size={16} style={{ marginRight: 6 }} />
            <span>EN</span>
          </div>
          <button className="btn-marketing-login" onClick={() => navigate('/onboarding/step-1?mode=signin')}>Sign In</button>
          <button className="btn-marketing-primary" onClick={goNext}>
            Start Free Trial
          </button>
        </div>
      </div>
    </header>
  );
}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useOnboarding } from '../../onboarding/context/OnboardingContext';
import { Boxes, Zap, Shield, Database } from 'lucide-react';
import MarketingHeader from '../components/MarketingHeader';
import MarketingFooter from '../components/MarketingFooter';

export default function LandingPage() {
  const { goNext, isClerkLoaded, isSignedIn } = useOnboarding();
  const navigate = useNavigate();

  // Animation variants
  const containerVars = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  const itemVars = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 20 } },
  };

  const featureCards = [
    {
      icon: <Database size={24} className="text-primary" />,
      title: 'Unified Architecture',
      desc: 'Centralize your master data, inventory, and financials in one lightning-fast system.',
    },
    {
      icon: <Zap size={24} className="text-primary" />,
      title: 'Built for Velocity',
      desc: 'Optimized state management and real-time syncing across all your organizational branches.',
    },
    {
      icon: <Boxes size={24} className="text-primary" />,
      title: 'Scalable Inventory',
      desc: 'Track multi-location stock movements, purchase orders, and fulfillment autonomously.',
    },
    {
      icon: <Shield size={24} className="text-primary" />,
      title: 'Enterprise Security',
      desc: 'Role-based access control with comprehensive audit logging and compliance built-in.',
    },
  ];

  return (
    <div className="landing-shell">
      {/* Background Animated Blobs */}
      <div className="landing-bg-elements">
        <div className="landing-blob landing-blob-1" />
        <div className="landing-blob landing-blob-2" />
        <div className="landing-grid-overlay" />
      </div>

      <MarketingHeader />

      <main className="landing-main landing-main-flex">
        <motion.div
          className="landing-content landing-hero-section"
          variants={containerVars}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVars} className="landing-badge">
            <span className="landing-badge-dot" /> v3.0 Early Access
          </motion.div>

          <motion.h1 variants={itemVars} className="landing-hero-title">
            The Operating System for <br />
            <span className="text-gradient">Modern Commerce</span>
          </motion.h1>

          <motion.p variants={itemVars} className="landing-hero-subtitle">
            Unify your inventory, sales, and operations on a single, lightning-fast architecture. 
            Built for limitless scale. Designed for velocity.
          </motion.p>

          <motion.div variants={itemVars} className="landing-cta-group">
            <button 
              className="landing-btn-primary" 
              onClick={() => {
                if (isSignedIn) {
                  navigate('/dashboard');
                } else {
                  goNext();
                }
              }}
            >
              {isClerkLoaded && isSignedIn ? 'Go to Dashboard' : 'Initialize Workspace'}
              <ArrowRight size={20} strokeWidth={2.5} className="landing-btn-icon" />
            </button>
            <button className="landing-btn-secondary" onClick={() => window.location.href = 'https://github.com/ERP-Software-Kenya/Web-ERP'}>
              View Documentation
            </button>
          </motion.div>

          <motion.div variants={itemVars} className="landing-features-grid">
            {featureCards.map((feat, idx) => (
              <div key={idx} className="landing-feature-card">
                <div className="landing-feature-icon-wrapper">
                  {feat.icon}
                </div>
                <h3 className="landing-feature-title">{feat.title}</h3>
                <p className="landing-feature-desc">{feat.desc}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </main>

      <MarketingFooter />
    </div>
  );
}

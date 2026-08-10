import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useOnboarding } from '../../onboarding/context/OnboardingContext';

interface Props {
  onScrollTo?: (id: string) => void;
}

const navItems = [
  { label: 'Modules', id: 'modules' },
  { label: 'Features', id: 'features' },
  { label: 'How It Works', id: 'how-it-works' },
  { label: 'Pricing', id: 'pricing' },
];

export default function MarketingHeader({ onScrollTo }: Props) {
  const { goNext } = useOnboarding();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const shell = document.querySelector('.lp-shell');
    const target = shell ?? window;

    const handleScroll = () => {
      const y = shell ? shell.scrollTop : window.scrollY;
      setScrolled(y > 20);
    };

    target.addEventListener('scroll', handleScroll, { passive: true });
    return () => target.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (id: string) => {
    onScrollTo?.(id);
    setMobileOpen(false);
  };

  return (
    <header className={`lp-header${scrolled ? ' scrolled' : ''}`}>
      <div className="lp-header-inner">
        {/* Logo */}
        <motion.div
          className="lp-header-logo"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="lp-logo-icon">W</div>
          <span>Web-ERP</span>
        </motion.div>

        {/* Desktop Nav */}
        <nav className="lp-header-nav" aria-label="Main navigation">
          {navItems.map((item, i) => (
            <motion.button
              key={item.id}
              className="lp-nav-link"
              onClick={() => handleNav(item.id)}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              {item.label}
            </motion.button>
          ))}
        </nav>

        {/* Actions */}
        <motion.div
          className="lp-header-actions"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <button
            className="lp-btn-login"
            onClick={() => navigate('/onboarding/step-1?mode=signin')}
          >
            Sign In
          </button>
          <button className="lp-btn-cta-sm" onClick={goNext}>
            Start Free
          </button>
          <button
            className="lp-hamburger"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </motion.div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="lp-mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                className="lp-mobile-nav-link"
                onClick={() => handleNav(item.id)}
              >
                {item.label}
              </button>
            ))}
            <div className="lp-mobile-actions">
              <button
                className="lp-btn-login"
                style={{ display: 'block' }}
                onClick={() => { navigate('/onboarding/step-1?mode=signin'); setMobileOpen(false); }}
              >
                Sign In
              </button>
              <button className="lp-btn-cta-sm" onClick={() => { goNext(); setMobileOpen(false); }}>
                Start Free
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

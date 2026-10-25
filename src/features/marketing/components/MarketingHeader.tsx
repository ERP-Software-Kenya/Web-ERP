import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, Menu, X } from 'lucide-react';
import { useOnboarding } from '../../onboarding/context/OnboardingContext';

interface Props {
  onScrollTo?: (id: string) => void;
}

const navItems = [
  { label: 'Platform', id: 'platform' },
  { label: 'Modules', id: 'modules' },
  { label: 'Operations', id: 'operations' },
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
    if (onScrollTo) {
      onScrollTo(id);
    } else {
      navigate(`/#${id}`);
    }
    setMobileOpen(false);
  };

  const handleStart = () => {
    goNext();
    setMobileOpen(false);
  };

  return (
    <header className={`lp-header${scrolled ? ' scrolled' : ''}`}>
      <div className="lp-header-inner">
        <Link className="lp-header-logo" to="/">
          <div className="lp-logo-icon">P</div>
          <span>Pramukh Digital</span>
        </Link>

        <nav className="lp-header-nav" aria-label="Main navigation">
          {navItems.map((item, i) => (
            <motion.button
              key={item.id}
              className="lp-nav-link"
              onClick={() => handleNav(item.id)}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.04 }}
            >
              {item.label}
            </motion.button>
          ))}
          <Link className="lp-nav-link lp-nav-link-anchor" to="/downloads">
            Downloads
          </Link>
        </nav>

        <motion.div
          className="lp-header-actions"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Link className="lp-btn-download-sm" to="/downloads">
            <Download size={16} />
            <span>Download apps</span>
          </Link>
          <button className="lp-btn-cta-sm" onClick={handleStart}>
            Start trial
          </button>
          <button
            className="lp-hamburger"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="lp-mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
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
            <Link className="lp-mobile-nav-link" to="/downloads" onClick={() => setMobileOpen(false)}>
              Downloads
            </Link>
            <div className="lp-mobile-actions">
              <Link className="lp-btn-download-sm" to="/downloads" onClick={() => setMobileOpen(false)}>
                <Download size={16} />
                Download apps
              </Link>
              <button className="lp-btn-cta-sm" onClick={handleStart}>
                Start trial
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

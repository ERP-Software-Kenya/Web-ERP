import React from 'react';
import { Twitter, Linkedin, Github, ArrowRight, MapPin } from 'lucide-react';

interface Props {
  onScrollTo?: (id: string) => void;
}

export default function MarketingFooter({ onScrollTo }: Props) {
  const productLinks = [
    { label: 'Inventory Management', id: 'modules' },
    { label: 'Sales & Invoicing', id: 'modules' },
    { label: 'Financial Accounting', id: 'modules' },
    { label: 'CRM', id: 'modules' },
    { label: 'HR & Payroll', id: 'modules' },
    { label: 'Pricing', id: 'pricing' },
  ];

  const companyLinks = [
    { label: 'About Us', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Partners', href: '#' },
    { label: 'Contact Sales', href: '#' },
    { label: 'System Status', href: '#' },
  ];

  const resourceLinks = [
    { label: 'Documentation', href: 'https://github.com/ERP-Software-Kenya/Web-ERP' },
    { label: 'API Reference', href: '#' },
    { label: 'Community Forum', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Help Center', href: '#' },
  ];

  return (
    <footer className="lp-footer">
      <div className="lp-footer-inner">
        {/* Brand column */}
        <div className="lp-footer-brand">
          <div className="lp-header-logo" style={{ marginBottom: 16 }}>
            <div className="lp-logo-icon">W</div>
            <span style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700 }}>Web-ERP</span>
          </div>
          <p className="lp-footer-tagline">
            The unified operating system for modern commerce.
            Scale your inventory, sales, and operations on a single architecture.
          </p>
          <div className="lp-footer-location">
            <MapPin size={13} />
            Built for Africa. Available worldwide.
          </div>
          <div className="lp-footer-newsletter">
            <p className="lp-footer-newsletter-label">Stay in the loop</p>
            <div className="lp-footer-newsletter-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="lp-footer-newsletter-input"
                aria-label="Email for newsletter"
              />
              <button className="lp-footer-newsletter-btn" aria-label="Subscribe">
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Product links */}
        <div className="lp-footer-col">
          <h4 className="lp-footer-col-heading">Product</h4>
          {productLinks.map((l) => (
            <button
              key={l.label}
              className="lp-footer-link"
              onClick={() => onScrollTo?.(l.id)}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Resources */}
        <div className="lp-footer-col">
          <h4 className="lp-footer-col-heading">Resources</h4>
          {resourceLinks.map((l) => (
            <a key={l.label} href={l.href} className="lp-footer-link" target="_blank" rel="noopener noreferrer">
              {l.label}
            </a>
          ))}
        </div>

        {/* Company */}
        <div className="lp-footer-col">
          <h4 className="lp-footer-col-heading">Company</h4>
          {companyLinks.map((l) => (
            <a key={l.label} href={l.href} className="lp-footer-link">
              {l.label}
            </a>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="lp-footer-bottom">
        <div className="lp-footer-copyright">
          © {new Date().getFullYear()} Web-ERP Technologies Inc. All rights reserved.
        </div>

        <div className="lp-footer-social">
          <a href="#" className="lp-social-link" aria-label="Twitter"><Twitter size={18} /></a>
          <a href="#" className="lp-social-link" aria-label="LinkedIn"><Linkedin size={18} /></a>
          <a
            href="https://github.com/ERP-Software-Kenya"
            className="lp-social-link"
            aria-label="GitHub"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github size={18} />
          </a>
        </div>

        <div className="lp-footer-legal">
          <a href="#" className="lp-footer-link-sm">Privacy Policy</a>
          <a href="#" className="lp-footer-link-sm">Terms of Service</a>
          <a href="#" className="lp-footer-link-sm">Security</a>
        </div>
      </div>
    </footer>
  );
}

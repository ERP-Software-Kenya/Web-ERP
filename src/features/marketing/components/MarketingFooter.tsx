import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Github, Linkedin, Mail, MapPin } from 'lucide-react';

interface Props {
  onScrollTo?: (id: string) => void;
}

export default function MarketingFooter({ onScrollTo }: Props) {
  const productLinks = [
    { label: 'Sales and POS', id: 'modules' },
    { label: 'Purchase control', id: 'modules' },
    { label: 'Inventory and stock', id: 'modules' },
    { label: 'Reports and analytics', id: 'platform' },
    { label: 'Branch operations', id: 'operations' },
  ];

  return (
    <footer className="lp-footer">
      <div className="lp-footer-inner">
        <div className="lp-footer-brand">
          <Link className="lp-header-logo" to="/" style={{ marginBottom: 16 }}>
            <div className="lp-logo-icon">P</div>
            <span style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700 }}>Pramukh Digital</span>
          </Link>
          <p className="lp-footer-tagline">
            Desktop-first ERP for growing distributors, retailers, wholesalers,
            and branch-led businesses.
          </p>
          <div className="lp-footer-location">
            <MapPin size={13} />
            Built for Kenya. Ready for multi-branch commerce.
          </div>
          <div className="lp-footer-newsletter">
            <p className="lp-footer-newsletter-label">Request a product walkthrough</p>
            <div className="lp-footer-newsletter-row">
              <input
                type="email"
                placeholder="Work email"
                className="lp-footer-newsletter-input"
                aria-label="Work email"
              />
              <button className="lp-footer-newsletter-btn" aria-label="Request walkthrough">
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="lp-footer-col">
          <h4 className="lp-footer-col-heading">Product</h4>
          {productLinks.map((link) => (
            <button
              key={link.label}
              className="lp-footer-link"
              onClick={() => onScrollTo?.(link.id)}
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="lp-footer-col">
          <h4 className="lp-footer-col-heading">Downloads</h4>
          <Link className="lp-footer-link" to="/downloads">Latest ERP client</Link>
          <Link className="lp-footer-link" to="/downloads">All desktop versions</Link>
          <a className="lp-footer-link" href="https://github.com/ERP-Software-Kenya/ERP-Client" target="_blank" rel="noreferrer">
            Desktop client repository
          </a>
        </div>

        <div className="lp-footer-col">
          <h4 className="lp-footer-col-heading">Company</h4>
          <a className="lp-footer-link" href="mailto:sales@pramukhdigital.com">
            Contact sales
          </a>
          <a className="lp-footer-link" href="mailto:support@pramukhdigital.com">
            Support
          </a>
          <a className="lp-footer-link" href="https://github.com/ERP-Software-Kenya" target="_blank" rel="noreferrer">
            Engineering
          </a>
        </div>
      </div>

      <div className="lp-footer-bottom">
        <div className="lp-footer-copyright">
          © {new Date().getFullYear()} Pramukh Digital. All rights reserved.
        </div>

        <div className="lp-footer-social">
          <a href="mailto:sales@pramukhdigital.com" className="lp-social-link" aria-label="Email">
            <Mail size={18} />
          </a>
          <a href="https://www.linkedin.com" className="lp-social-link" aria-label="LinkedIn" target="_blank" rel="noreferrer">
            <Linkedin size={18} />
          </a>
          <a href="https://github.com/ERP-Software-Kenya" className="lp-social-link" aria-label="GitHub" target="_blank" rel="noreferrer">
            <Github size={18} />
          </a>
        </div>

        <div className="lp-footer-legal">
          <a href="mailto:support@pramukhdigital.com" className="lp-footer-link-sm">Security</a>
          <Link to="/downloads" className="lp-footer-link-sm">Downloads</Link>
        </div>
      </div>
    </footer>
  );
}

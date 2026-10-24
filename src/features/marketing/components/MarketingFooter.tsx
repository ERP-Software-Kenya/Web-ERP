import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Github, Linkedin, Mail, MapPin } from 'lucide-react';

interface Props {
  onScrollTo?: (id: string) => void;
}

export default function MarketingFooter({ onScrollTo }: Props) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const productLinks = [
    { label: 'Sales & POS Invoicing', id: 'modules' },
    { label: 'Purchase Control', id: 'modules' },
    { label: 'Inventory & Batches', id: 'modules' },
    { label: 'Branch Analytics', id: 'platform' },
    { label: 'Manager Approvals', id: 'operations' },
  ];

  const handleLinkClick = (id: string) => {
    if (onScrollTo) {
      onScrollTo(id);
    } else {
      navigate(`/#${id}`);
    }
  };

  const handleWalkthroughSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubmitted(true);
  };

  return (
    <footer className="lp-footer">
      <div className="lp-footer-inner">
        <div className="lp-footer-brand">
          <Link className="lp-header-logo" to="/" style={{ marginBottom: 16 }}>
            <div className="lp-logo-icon">P</div>
            <span style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700 }}>Pramukh Digital ERP</span>
          </Link>
          <p className="lp-footer-tagline">
            Professional desktop-first ERP for commercial retailers, wholesalers, and multi-branch distribution businesses in Kenya.
          </p>
          <div className="lp-footer-location">
            <MapPin size={14} />
            <span>Built for Kenyan commerce · Offline-first desktop speed</span>
          </div>

          <div className="lp-footer-newsletter">
            <p className="lp-footer-newsletter-label">Request an enterprise walkthrough</p>
            {submitted ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#4ade80', fontSize: '0.84rem', marginTop: 8 }}>
                <CheckCircle2 size={16} />
                <span>Thank you! Our Nairobi sales team will reach out.</span>
              </div>
            ) : (
              <form onSubmit={handleWalkthroughSubmit} className="lp-footer-newsletter-row">
                <input
                  type="email"
                  placeholder="Work email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="lp-footer-newsletter-input"
                  aria-label="Work email address"
                  required
                />
                <button type="submit" className="lp-footer-newsletter-btn" aria-label="Submit request">
                  <ArrowRight size={16} />
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="lp-footer-col">
          <h4 className="lp-footer-col-heading">Operational Modules</h4>
          {productLinks.map((link) => (
            <button
              key={link.label}
              type="button"
              className="lp-footer-link"
              onClick={() => handleLinkClick(link.id)}
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="lp-footer-col">
          <h4 className="lp-footer-col-heading">Desktop Downloads</h4>
          <Link className="lp-footer-link" to="/downloads">Production Client (v1.1.0)</Link>
          <Link className="lp-footer-link" to="/downloads">All Desktop Builds</Link>
          <a className="lp-footer-link" href="https://github.com/ERP-Software-Kenya/ERP-Client" target="_blank" rel="noreferrer">
            GitHub Release Pipeline
          </a>
        </div>

        <div className="lp-footer-col">
          <h4 className="lp-footer-col-heading">Sales & Support</h4>
          <a className="lp-footer-link" href="mailto:sales@pramukhdigital.com">
            sales@pramukhdigital.com
          </a>
          <a className="lp-footer-link" href="mailto:support@pramukhdigital.com">
            support@pramukhdigital.com
          </a>
          <a className="lp-footer-link" href="https://github.com/ERP-Software-Kenya" target="_blank" rel="noreferrer">
            ERP-Software-Kenya
          </a>
        </div>
      </div>

      <div className="lp-footer-bottom">
        <div className="lp-footer-copyright">
          © {new Date().getFullYear()} Pramukh Digital ERP. All rights reserved. Built for East African Commerce.
        </div>

        <div className="lp-footer-social">
          <a href="mailto:sales@pramukhdigital.com" className="lp-social-link" aria-label="Email">
            <Mail size={18} />
          </a>
          <a href="https://github.com/ERP-Software-Kenya" className="lp-social-link" aria-label="GitHub" target="_blank" rel="noreferrer">
            <Github size={18} />
          </a>
        </div>

        <div className="lp-footer-legal">
          <Link to="/downloads" className="lp-footer-link-sm">Desktop Releases</Link>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
          <span className="lp-footer-link-sm">Privacy & Security</span>
        </div>
      </div>
    </footer>
  );
}

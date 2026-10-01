import React from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import { Download, Globe, ExternalLink } from 'lucide-react';
import { useLatestRelease } from '../../shared/hooks/useLatestRelease';

const WEB_CLIENT_URL = import.meta.env.VITE_CLIENT_URL
  ? (import.meta.env.VITE_CLIENT_URL === 'http://localhost:5173' ? 'https://app.pramukhdigital.com' : import.meta.env.VITE_CLIENT_URL)
  : 'https://app.pramukhdigital.com';

export default function Step8Done() {
  const { data } = useOnboarding();
  const { version, loading, handleDownload } = useLatestRelease();
  const displayName = data.orgName.trim() || 'Your Organization';
  const firstName = data.firstName.trim() || 'Admin';

  const actionCards: { icon: string; iconBg: string; title: string; desc: string }[] = [];
  let primaryCtaText = 'Open Web Dashboard';

  if (data.modules.includes('inventory')) {
    actionCards.push({ icon: '📦', iconBg: '#eff6ff', title: 'Add your first product', desc: 'Build your inventory catalog' });
    primaryCtaText = 'Go to Inventory Dashboard';
  }
  if (data.modules.includes('sales') || data.modules.includes('accounting')) {
    actionCards.push({ icon: '🧾', iconBg: '#f0fdf4', title: 'Create an invoice', desc: 'Send your first professional invoice' });
    if (primaryCtaText === 'Open Web Dashboard') primaryCtaText = 'Go to Sales & Invoicing';
  }
  if (data.modules.includes('fleet')) {
    actionCards.push({ icon: '🚚', iconBg: '#fef3c7', title: 'Add your first vehicle', desc: 'Set up fleet management and GPS tracking' });
    if (primaryCtaText === 'Open Web Dashboard') primaryCtaText = 'Go to Fleet Dashboard';
  }
  if (data.modules.includes('crm')) {
    actionCards.push({ icon: '👤', iconBg: '#fdf4ff', title: 'Add a customer', desc: 'Start building your customer base' });
  }
  if (data.modules.includes('hr')) {
    actionCards.push({ icon: '👥', iconBg: '#fffbeb', title: 'Add your first employee', desc: 'Set up your team and payroll' });
    if (primaryCtaText === 'Open Web Dashboard') primaryCtaText = 'Go to HR Dashboard';
  }
  if (actionCards.length === 0) {
    actionCards.push({ icon: '⚙️', iconBg: '#f1f5f9', title: 'Configure Settings', desc: 'Review your workspace configuration' });
  }

  const downloadLabel = loading
    ? 'Preparing Download...'
    : version && version !== 'Latest'
      ? `Download Pramukh Digital ${version}`
      : 'Download Pramukh Digital';

  return (
    <div className="done-page">
      {/* Left */}
      <div className="done-left">
        <div className="done-badge">
          <span>✅</span>
          <span>Ready to go!</span>
        </div>

        <h1 className="done-title">Your workspace is live!</h1>
        <p className="done-subtitle">
          You're all set, {firstName}. Here's where to start with{' '}
          <strong>{displayName}</strong>.
        </p>

        <div className="action-cards">
          {actionCards.map(card => (
            <div key={card.title} className="action-card done-action-card">
              <div className="action-card-icon-wrap" style={{ background: card.iconBg }}>
                {card.icon}
              </div>
              <div className="action-card-content">
                <div className="action-card-title">{card.title}</div>
                <div className="action-card-desc">{card.desc}</div>
              </div>
              <span className="action-card-arrow">→</span>
            </div>
          ))}
        </div>

        <div className="done-ctas">
          <button
            id="btn-download-desktop"
            className="btn-download"
            onClick={handleDownload}
            disabled={loading}
            style={{ cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.75 : 1 }}
          >
            <Download size={18} strokeWidth={2} />
            {downloadLabel}
          </button>

          <a
            id="btn-open-web"
            className="btn-primary done-btn-primary"
            href={WEB_CLIENT_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none' }}
          >
            <Globe size={16} strokeWidth={2} />
            {primaryCtaText}
            <ExternalLink size={14} strokeWidth={2} style={{ opacity: 0.7 }} />
          </a>

          <p className="done-desktop-hint">
            The desktop app is recommended for the best offline experience
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="done-right">
        <div className="done-preview-card">
          <div className="done-confetti">🎉</div>
          <div className="done-card-title">{displayName} is ready!</div>
          <div className="done-card-sub">
            Your Pramukh Digital workspace has been configured based on your preferences.
          </div>

          <div className="done-quick-stats">
            <div className="done-quick-stat">
              <div className="done-quick-stat-icon">📦</div>
              <div className="done-quick-stat-val">Ready</div>
              <div className="done-quick-stat-lbl">Inventory</div>
            </div>
            <div className="done-quick-stat">
              <div className="done-quick-stat-icon">🧾</div>
              <div className="done-quick-stat-val">Active</div>
              <div className="done-quick-stat-lbl">Invoicing</div>
            </div>
            <div className="done-quick-stat">
              <div className="done-quick-stat-icon">📊</div>
              <div className="done-quick-stat-val">Live</div>
              <div className="done-quick-stat-lbl">Reports</div>
            </div>
          </div>

          <div className="done-download-promo">
            <div className="done-download-promo-icon">💻</div>
            <div className="done-download-promo-text">
              <strong>
                {loading
                  ? 'Pramukh Digital Desktop'
                  : version && version !== 'Latest'
                    ? `Pramukh Digital ${version}`
                    : 'Pramukh Digital Desktop'}
              </strong>
              Download for Windows. Works offline with full feature access.
            </div>
            <button
              onClick={handleDownload}
              className="done-download-link"
              disabled={loading}
              style={{
                background: loading ? 'var(--color-text-muted)' : undefined,
                cursor: loading ? 'wait' : 'pointer',
              }}
            >
              {loading ? '...' : 'Download'}
            </button>
          </div>

          {data.modules.length > 0 && (
            <div className="done-modules-section">
              <div className="done-modules-header">Your configured modules</div>
              <div className="done-modules-container">
                {data.modules.map((m: string) => (
                  <span key={m} className="done-module-tag">{m}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

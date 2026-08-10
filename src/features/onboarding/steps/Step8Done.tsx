import React from 'react';
import { useOnboarding } from '../context/OnboardingContext';

// Link to the GitHub Releases API to fetch the latest download
const GITHUB_API_LATEST = 'https://api.github.com/repos/ERP-Software-Kenya/ERP-Client/releases/latest';
const GITHUB_RELEASES_URL = 'https://github.com/ERP-Software-Kenya/ERP-Client/releases/latest';

export default function Step8Done() {
  const { data } = useOnboarding();
  const displayName = data.orgName.trim() || 'Your Organization';
  const firstName = data.firstName.trim() || 'Admin';

  const handleDownloadClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(GITHUB_API_LATEST);
      const release = await response.json();
      const exeAsset = release.assets?.find((asset: any) => asset.name.endsWith('.exe'));
      
      if (exeAsset) {
        // Direct download
        window.location.href = exeAsset.browser_download_url;
      } else {
        // Fallback to releases page
        window.open(GITHUB_RELEASES_URL, '_blank');
      }
    } catch (err) {
      console.error('Failed to fetch latest release', err);
      // Fallback
      window.open(GITHUB_RELEASES_URL, '_blank');
    }
  };

  // Dynamically generate action cards based on selected modules
  const actionCards = [];
  let primaryCtaText = "Access via Web Browser";

  if (data.modules.includes('inventory')) {
    actionCards.push({
      icon: '📦',
      iconBg: '#eff6ff',
      title: 'Add your first product',
      desc: 'Build your inventory catalog',
    });
    primaryCtaText = "Go to Inventory Dashboard";
  }
  if (data.modules.includes('sales') || data.modules.includes('accounting')) {
    actionCards.push({
      icon: '🧾',
      iconBg: '#f0fdf4',
      title: 'Create an invoice',
      desc: 'Send your first professional invoice',
    });
    if (primaryCtaText === "Access via Web Browser") primaryCtaText = "Go to Sales & Invoicing";
  }
  if (data.modules.includes('crm')) {
    actionCards.push({
      icon: '👤',
      iconBg: '#fdf4ff',
      title: 'Add a customer',
      desc: 'Start building your customer base',
    });
  }
  if (data.modules.includes('hr')) {
    actionCards.push({
      icon: '👥',
      iconBg: '#fffbeb',
      title: 'Add your first employee',
      desc: 'Set up your team and payroll',
    });
    if (primaryCtaText === "Access via Web Browser") primaryCtaText = "Go to HR Dashboard";
  }

  // Fallback if no specific actions were matched
  if (actionCards.length === 0) {
    actionCards.push({
      icon: '⚙️',
      iconBg: '#f1f5f9',
      title: 'Configure Settings',
      desc: 'Review your workspace configuration',
    });
  }

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
            onClick={handleDownloadClick}
            style={{ cursor: 'pointer' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download Web-ERP Desktop App
          </button>

          <a
            id="btn-open-web"
            className="btn-primary done-btn-primary"
            href={import.meta.env.VITE_CLIENT_URL || "http://localhost:5173"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
            </svg>
            {primaryCtaText}
          </a>

          <p className="done-desktop-hint">
            The desktop app is recommended for the best experience
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="done-right">
        <div className="done-preview-card">
          <div className="done-confetti">🎉</div>
          <div className="done-card-title">{displayName} is ready!</div>
          <div className="done-card-sub">
            Your ERP workspace has been configured based on your preferences.
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
              <strong>Get the Desktop App</strong>
              Download for Windows, macOS, or Linux. Works offline.
            </div>
            <button
              onClick={handleDownloadClick}
              className="done-download-link"
              style={{ background: 'transparent', border: 'none', padding: 0 }}
            >
              Download
            </button>
          </div>

          {data.modules.length > 0 && (
            <div className="done-modules-section">
              <div className="done-modules-header">
                Your configured modules
              </div>
              <div className="done-modules-container">
                {data.modules.map((m: any) => (
                  <span key={m} className="done-module-tag">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

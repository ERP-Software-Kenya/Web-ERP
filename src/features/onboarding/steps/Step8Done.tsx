import React from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import { Download } from 'lucide-react';
import { latestErpClientRelease } from '../../downloads/data/releases';

// Link to the GitHub Releases API to fetch the latest download
const GITHUB_API_LATEST = 'https://api.github.com/repos/ERP-Software-Kenya/ERP-Client/releases/latest';
const LATEST_INSTALLER_URL = latestErpClientRelease.assets[0].url;

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
        window.location.href = LATEST_INSTALLER_URL;
      }
    } catch (err) {
      console.error('Failed to fetch latest release', err);
      window.location.href = LATEST_INSTALLER_URL;
    }
  };

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
          Congratulations, {firstName}. <strong>{displayName}</strong> is ready.
          Download the desktop ERP client to start using sales, purchase,
          inventory, reports, and branch operations.
        </p>

        <div className="done-next-steps">
          <div className="done-next-step">
            <span>1</span>
            <div>
              <strong>Download the desktop app</strong>
              <p>Install the latest Pramukh Digital ERP Client on your Windows machine.</p>
            </div>
          </div>
          <div className="done-next-step">
            <span>2</span>
            <div>
              <strong>Sign in inside the desktop client</strong>
              <p>Use the account you just created to access your configured workspace.</p>
            </div>
          </div>
          <div className="done-next-step">
            <span>3</span>
            <div>
              <strong>Run your branch operations</strong>
              <p>Continue setup and daily work from the desktop ERP application.</p>
            </div>
          </div>
        </div>

        <div className="done-ctas">
          <button
            id="btn-download-desktop"
            className="btn-download"
            onClick={handleDownloadClick}
            style={{ cursor: 'pointer' }}
          >
            <Download size={18} strokeWidth={2} />
            Download Web-ERP Desktop App
          </button>

          <p className="done-desktop-hint">
            Dashboard access is available only inside the desktop app.
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

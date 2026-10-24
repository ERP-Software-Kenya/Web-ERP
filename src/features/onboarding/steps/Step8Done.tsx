import React, { useState } from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import { Download, CheckCircle2, Monitor, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { latestErpClientRelease } from '../../downloads/data/releases';
import { Link } from 'react-router-dom';

const GITHUB_API_LATEST = 'https://api.github.com/repos/ERP-Software-Kenya/ERP-Client/releases/latest';
const LATEST_INSTALLER_URL = latestErpClientRelease.assets[0].url;

export default function Step8Done() {
  const { data } = useOnboarding();
  const displayName = data.orgName.trim() || 'Your Business Workspace';
  const firstName = data.firstName.trim() || 'Admin';
  const [downloading, setDownloading] = useState(false);

  const handleDownloadClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setDownloading(true);
    try {
      const response = await fetch(GITHUB_API_LATEST);
      if (response.ok) {
        const release = await response.json();
        const exeAsset = release.assets?.find((asset: any) => asset.name.endsWith('.exe'));
        if (exeAsset?.browser_download_url) {
          window.location.href = exeAsset.browser_download_url;
          setDownloading(false);
          return;
        }
      }
      window.location.href = LATEST_INSTALLER_URL;
    } catch {
      window.location.href = LATEST_INSTALLER_URL;
    } finally {
      setTimeout(() => setDownloading(false), 2000);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg)',
        color: 'var(--color-text)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 960,
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 20,
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
        }}
      >
        {/* Left Side: Setup Success & Instructions */}
        <div style={{ padding: '40px 36px', display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 12px',
              borderRadius: 999,
              background: 'rgba(34, 197, 94, 0.15)',
              color: 'var(--color-success)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              width: 'fit-content',
              marginBottom: 16,
            }}
          >
            <CheckCircle2 size={16} />
            <span>Workspace Configured Successfully</span>
          </div>

          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: 8, letterSpacing: '-0.02em' }}>
            {displayName} is ready!
          </h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: 28 }}>
            Congratulations, {firstName}. Your Pramukh Digital ERP cloud organization has been provisioned. Download the desktop client to start daily sales, stock control, and branch operations.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
            <div style={{ display: 'flex', gap: 14 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'var(--color-primary-glow)',
                  color: 'var(--color-primary)',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                1
              </div>
              <div>
                <strong style={{ fontSize: '0.9rem', color: 'var(--color-text)', display: 'block' }}>
                  Install the Windows Desktop Client
                </strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  Download the official 64-bit installer for Windows 10 or 11.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 14 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'var(--color-primary-glow)',
                  color: 'var(--color-primary)',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                2
              </div>
              <div>
                <strong style={{ fontSize: '0.9rem', color: 'var(--color-text)', display: 'block' }}>
                  Log In with Your Admin Credentials
                </strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  Use the email ({data.email || 'your email'}) and password you configured.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 14 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'var(--color-primary-glow)',
                  color: 'var(--color-primary)',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                3
              </div>
              <div>
                <strong style={{ fontSize: '0.9rem', color: 'var(--color-text)', display: 'block' }}>
                  Run Your Store & Branch Operations
                </strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  Start counter POS, import inventory items, or set up supplier records.
                </span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              type="button"
              id="btn-download-desktop"
              className="btn-primary"
              onClick={handleDownloadClick}
              disabled={downloading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                padding: '14px 20px',
                fontSize: '0.9375rem',
              }}
            >
              {downloading ? (
                <>
                  <RefreshCw size={18} className="release-spin" />
                  <span>Preparing Download...</span>
                </>
              ) : (
                <>
                  <Download size={18} />
                  <span>Download Pramukh Digital ERP (Windows x64)</span>
                </>
              )}
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              <Link to="/downloads" style={{ fontSize: '0.8125rem', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>
                View all release versions & checksums →
              </Link>
              <Link to="/" style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}>
                Back to overview
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side: Operational Summary Card */}
        <div
          style={{
            background: 'var(--color-surface-2)',
            borderLeft: '1px solid var(--color-border)',
            padding: '40px 32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: 'var(--color-primary)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                }}
              >
                P
              </div>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)' }}>
                  Pramukh Digital ERP
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Desktop-First Enterprise Edition
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 12,
                padding: 16,
                marginBottom: 20,
              }}
            >
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                Active Workspace Profile
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Business Name</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{displayName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Base Currency</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>KES (Kenyan Shilling)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Country</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{data.country || 'Kenya'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Subscription</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-primary)', textTransform: 'capitalize' }}>
                    {data.plan || 'Growth'} Plan
                  </span>
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Enabled Workflows
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
              {(data.modules.length > 0 ? data.modules : ['inventory', 'sales', 'reports']).map((mod) => (
                <span
                  key={mod}
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    padding: '4px 10px',
                    borderRadius: 6,
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text)',
                    textTransform: 'capitalize',
                  }}
                >
                  {mod}
                </span>
              ))}
            </div>
          </div>

          <div
            style={{
              padding: 14,
              borderRadius: 10,
              background: 'rgba(79, 122, 248, 0.08)',
              border: '1px solid var(--color-primary-glow)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <ShieldCheck size={24} color="var(--color-primary)" />
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
              Desktop client updates are delivered through our secure GitHub Release pipeline.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

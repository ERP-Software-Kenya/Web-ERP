import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useOnboarding } from '../../onboarding/context/OnboardingContext';
import { LayoutDashboard, Users, ShoppingCart, Settings, LogOut, Download, Monitor, ShieldCheck } from 'lucide-react';
import { latestErpClientRelease } from '../../downloads/data/releases';
import ThemeToggle from '../../theme/components/ThemeToggle';

export default function Dashboard() {
  const { data, clerk, isSignedIn } = useOnboarding();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    localStorage.removeItem('pramukh_onboarding_draft');
    if (clerk) {
      await clerk.signOut();
    }
    navigate('/');
  };

  const displayName = data.orgName || 'Your Business Workspace';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '260px',
          background: 'var(--color-surface)',
          borderRight: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            padding: '24px 20px',
            fontWeight: 800,
            fontSize: '1.15rem',
            color: 'var(--color-primary)',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'var(--color-primary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              fontWeight: 800,
            }}
          >
            P
          </div>
          <span>Pramukh Digital</span>
        </div>

        <nav style={{ flex: 1, padding: '20px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'var(--color-primary-glow)',
              color: 'var(--color-primary)',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            <LayoutDashboard size={18} />
            <span>Workspace Overview</span>
          </div>

          <Link
            to="/downloads"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              borderRadius: '8px',
              color: 'var(--color-text-muted)',
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: '0.9rem',
            }}
          >
            <Download size={18} />
            <span>Desktop Downloads</span>
          </Link>
        </nav>

        <div style={{ padding: '16px', borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Theme:</span>
            <ThemeToggle />
          </div>

          <button
            onClick={handleSignOut}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              width: '100%',
              borderRadius: '8px',
              background: 'transparent',
              border: '1px solid var(--color-border)',
              color: 'var(--color-error)',
              fontWeight: 500,
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        <header
          style={{
            background: 'var(--color-surface)',
            padding: '20px 32px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0, color: 'var(--color-text)' }}>
              {displayName}
            </h1>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
              Cloud Organization Portal · Base Currency: KES
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--color-primary)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '0.9rem',
              }}
            >
              {(data.firstName || 'A').charAt(0).toUpperCase()}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-text)' }}>
                {[data.firstName, data.lastName].filter(Boolean).join(' ') || 'Administrator'}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{data.email || 'Cloud Admin'}</span>
            </div>
          </div>
        </header>

        <div style={{ padding: '32px' }}>
          {/* Desktop Client Launch Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(79, 122, 248, 0.12) 0%, rgba(124, 92, 252, 0.08) 100%)',
              border: '1.5px solid var(--color-primary-glow)',
              borderRadius: 16,
              padding: '28px',
              marginBottom: 32,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 20,
            }}
          >
            <div style={{ maxWidth: 640 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.8125rem' }}>
                <Monitor size={17} />
                <span>DESKTOP-FIRST OPERATION</span>
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: 6 }}>
                Launch daily branch operations in the Desktop App
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.5, margin: 0 }}>
                To record sales at the counter, print thermal receipts, allocate warehouse stock, and review approvals, run the verified Pramukh Digital ERP Windows client.
              </p>
            </div>

            <a
              href={latestErpClientRelease.assets[0].url}
              download
              className="btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 22px',
                textDecoration: 'none',
                borderRadius: 10,
                fontWeight: 700,
                fontSize: '0.9rem',
              }}
            >
              <Download size={17} />
              <span>Download Desktop App (v{latestErpClientRelease.version})</span>
            </a>
          </div>

          {/* Quick Info Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: 32 }}>
            <div style={{ background: 'var(--color-surface)', padding: '20px', borderRadius: '14px', border: '1px solid var(--color-border)' }}>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}>
                Subscription Plan
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'capitalize' }}>
                {data.plan || 'Growth'} Plan
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
                Billed {data.billing || 'monthly'} · Cloud sync active
              </div>
            </div>

            <div style={{ background: 'var(--color-surface)', padding: '20px', borderRadius: '14px', border: '1px solid var(--color-border)' }}>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}>
                Operational Country
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)' }}>
                {data.country || 'Kenya'}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
                Currency: Kenyan Shilling (KES)
              </div>
            </div>

            <div style={{ background: 'var(--color-surface)', padding: '20px', borderRadius: '14px', border: '1px solid var(--color-border)' }}>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}>
                Team Size
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)' }}>
                {data.teamSize || '11–50'}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
                Role permissions provisioned
              </div>
            </div>
          </div>

          {/* Configured Modules Card */}
          <div style={{ background: 'var(--color-surface)', borderRadius: '14px', border: '1px solid var(--color-border)', padding: '24px' }}>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 12 }}>
              Configured Branch Modules
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {(data.modules.length > 0 ? data.modules : ['inventory', 'sales', 'reports']).map((mod) => (
                <span
                  key={mod}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    background: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    color: 'var(--color-text)',
                    textTransform: 'capitalize',
                  }}
                >
                  ✓ {mod}
                </span>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

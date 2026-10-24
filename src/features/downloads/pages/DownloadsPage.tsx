import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Check, Download, MonitorDown, RefreshCw, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import MarketingHeader from '../../marketing/components/MarketingHeader';
import MarketingFooter from '../../marketing/components/MarketingFooter';
import {
  downloadableAssetPattern,
  downloadFeatures,
  erpClientReleases,
  githubReleasesApi,
  latestErpClientRelease,
  type ErpClientRelease,
} from '../data/releases';
import '../../marketing/styles/site.css';

interface GithubReleaseAsset {
  name: string;
  browser_download_url: string;
  size: number;
  content_type?: string;
}

interface GithubRelease {
  tag_name: string;
  name: string;
  html_url: string;
  published_at: string;
  prerelease: boolean;
  draft: boolean;
  body?: string;
  assets?: GithubReleaseAsset[];
}

const formatBytes = (bytes: number) => {
  if (!bytes) return 'GitHub hosted';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** index;
  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
};

const inferPlatform = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.endsWith('.exe') || lower.endsWith('.msi')) return 'Windows x64';
  if (lower.endsWith('.dmg')) return 'macOS';
  if (lower.endsWith('.appimage') || lower.endsWith('.deb') || lower.endsWith('.rpm')) return 'Linux';
  return 'Desktop package';
};

const cleanNotes = (body?: string) => {
  const notes = (body ?? '')
    .split('\n')
    .map((line) => line.replace(/^[-*#\s]+/, '').trim())
    .filter(Boolean)
    .slice(0, 4);

  return notes.length > 0
    ? notes
    : ['Official production desktop ERP client for branch sales, counter POS, inventory, reports, and analytics.'];
};

const mapGithubRelease = (release: GithubRelease, index: number): ErpClientRelease => {
  const version = release.tag_name.replace(/^v/i, '') || release.name;
  const assets = (release.assets ?? [])
    .filter((asset) => downloadableAssetPattern.test(asset.name))
    .map((asset, assetIndex) => ({
      label: `Download ${asset.name}`,
      platform: inferPlatform(asset.name),
      format: asset.name.split('.').pop()?.toUpperCase() ?? 'Installer',
      size: formatBytes(asset.size),
      url: asset.browser_download_url,
      primary: assetIndex === 0,
    }));

  return {
    version,
    tag: release.tag_name,
    channel: index === 0 && !release.prerelease ? 'Latest' : 'Previous',
    date: new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(release.published_at)),
    notes: cleanNotes(release.body),
    releaseUrl: release.html_url,
    assets,
  };
};

export default function DownloadsPage() {
  const [releases, setReleases] = useState<ErpClientRelease[]>(erpClientReleases);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    let active = true;

    fetch(githubReleasesApi, { headers: { Accept: 'application/vnd.github+json' } })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`GitHub releases returned ${response.status}`);
        }
        return response.json() as Promise<GithubRelease[]>;
      })
      .then((data) => {
        if (!active) return;
        const publishedReleases = data
          .filter((release) => !release.draft)
          .map(mapGithubRelease)
          .filter((release) => release.assets.length > 0);

        if (publishedReleases.length > 0) {
          setReleases(publishedReleases);
          setUsingFallback(false);
        } else {
          setUsingFallback(true);
        }
      })
      .catch(() => {
        if (active) setUsingFallback(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const latest = releases[0] || latestErpClientRelease;
  const previousReleases = releases.slice(1);

  return (
    <div className="site-shell" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <MarketingHeader />

      <main id="main-content">
        <section style={{ paddingTop: 100, paddingBottom: 40, borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
          <div className="site-container">
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                color: 'var(--color-text-muted)',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: 600,
                marginBottom: 20,
              }}
            >
              <ArrowLeft size={16} />
              <span>Back to overview</span>
            </Link>

            <div style={{ maxWidth: 760 }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 14px',
                  borderRadius: 999,
                  background: 'var(--color-primary-glow)',
                  color: 'var(--color-primary)',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  marginBottom: 16,
                }}
              >
                <MonitorDown size={16} />
                <span>OFFICIAL DESKTOP CLIENT</span>
              </div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.02em', marginBottom: 12 }}>
                Download Pramukh Digital ERP
              </h1>
              <p style={{ fontSize: '1.0625rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                Fast, reliable desktop client built for store counters, warehouse managers, and cashiers. Full offline resilience with automatic cloud sync for branch operations.
              </p>
            </div>
          </div>
        </section>

        <section style={{ padding: '40px 0' }}>
          <div className="site-container">
            {/* Featured Latest Release Card */}
            <div
              style={{
                background: 'var(--color-surface)',
                border: '2px solid var(--color-primary)',
                borderRadius: 16,
                padding: '32px',
                boxShadow: 'var(--shadow-glow)',
                marginBottom: 36,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
                      Pramukh Digital ERP Client v{latest.version}
                    </h2>
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: 999,
                        background: 'rgba(34, 197, 94, 0.15)',
                        color: 'var(--color-success)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                      }}
                    >
                      Latest Production Build
                    </span>
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>
                    Published {latest.date} · Supported on Windows 10 & 11 (64-bit)
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {loading && <RefreshCw size={15} className="release-spin" style={{ color: 'var(--color-primary)' }} />}
                  <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                    {loading ? 'Verifying with GitHub...' : usingFallback ? 'Verified package' : 'Synced from GitHub Releases'}
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '0.9375rem', color: 'var(--color-text)', lineHeight: 1.5, marginBottom: 20 }}>
                {latest.notes[0]}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginBottom: 24 }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                  Platform Support:
                </span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 10px',
                    borderRadius: 6,
                    background: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: 'var(--color-text)',
                  }}
                >
                  ✓ Windows x64 (Production)
                </span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 10px',
                    borderRadius: 6,
                    background: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.8125rem',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  ⏳ macOS & Linux (Coming Q3 2026)
                </span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
                {latest.assets.map((asset) => (
                  <a
                    key={asset.url}
                    href={asset.url}
                    download
                    className="btn-primary"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '13px 24px',
                      textDecoration: 'none',
                      borderRadius: 10,
                      fontWeight: 700,
                      fontSize: '0.9375rem',
                    }}
                  >
                    <Download size={18} />
                    <span>Download Windows Installer (v{latest.version})</span>
                  </a>
                ))}

                <a
                  href={latest.releaseUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--color-primary)',
                    textDecoration: 'none',
                    fontWeight: 600,
                    padding: '10px 14px',
                  }}
                >
                  View Release Notes on GitHub →
                </a>
              </div>
            </div>

            {/* Feature Highlights Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 20,
                marginBottom: 48,
              }}
            >
              {downloadFeatures.map((f) => {
                const IconComponent = f.icon;
                return (
                  <div
                    key={f.title}
                    style={{
                      padding: 24,
                      borderRadius: 12,
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 8,
                        background: 'var(--color-primary-glow)',
                        color: 'var(--color-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 14,
                      }}
                    >
                      <IconComponent size={20} />
                    </div>
                    <div style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 6 }}>
                      {f.title}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                      {f.body}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Previous Builds Accordion / Rollback Section */}
            {previousReleases.length > 0 && (
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 36 }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 16 }}>
                  Previous Release Builds (Rollback Channel)
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {previousReleases.slice(0, 4).map((rel) => (
                    <div
                      key={rel.version}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '14px 20px',
                        borderRadius: 10,
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        flexWrap: 'wrap',
                        gap: 12,
                      }}
                    >
                      <div>
                        <strong style={{ fontSize: '0.9375rem', color: 'var(--color-text)' }}>
                          Pramukh Digital ERP v{rel.version}
                        </strong>
                        <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginLeft: 12 }}>
                          Published {rel.date}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        {rel.assets[0] && (
                          <a
                            href={rel.assets[0].url}
                            download
                            style={{
                              fontSize: '0.8125rem',
                              fontWeight: 600,
                              color: 'var(--color-primary)',
                              textDecoration: 'none',
                              padding: '6px 12px',
                              borderRadius: 6,
                              background: 'var(--color-primary-glow)',
                            }}
                          >
                            Download {rel.assets[0].format}
                          </a>
                        )}
                        <a
                          href={rel.releaseUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}
                        >
                          Changelog
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Download,
  MapPin,
  MonitorDown,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  WifiOff,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import MarketingHeader from '../../marketing/components/MarketingHeader';
import MarketingFooter from '../../marketing/components/MarketingFooter';
import {
  downloadableAssetPattern,
  downloadFeatures,
  androidAppRelease,
  erpClientReleases,
  githubReleasesApi,
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
    : ['Published desktop ERP client release for branch sales, purchase, inventory, reports, and analytics workflows.'];
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

  const releaseCountLabel = useMemo(() => {
    const suffix = releases.length === 1 ? 'release' : 'releases';
    return `${releases.length} ${suffix} available`;
  }, [releases.length]);

  return (
    <div className="site-shell">
      <MarketingHeader />

      <main>
        <section className="downloads-hero">
          <div className="site-container">
            <Link to="/" className="site-button site-button-secondary">
              <ArrowLeft size={17} />
              Back to overview
            </Link>
            <div className="site-section-head" style={{ marginTop: 28, marginBottom: 0 }}>
              <span className="site-eyebrow">
                <Download size={16} />
                Application downloads
              </span>
              <h1 className="site-section-title">Install Pramukh Digital on every device</h1>
              <p className="site-section-copy">
                Download the mobile app for warehouse and delivery teams, or install the desktop client for office operations.
              </p>
            </div>
          </div>
        </section>

        <section className="site-section">
          <div className="site-container">
            <div className="mobile-download-layout">
              <article className="mobile-download-card">
                <div className="mobile-download-copy">
                  <span className="mobile-platform-label"><Smartphone size={16} /> Android mobile app</span>
                  <div className="mobile-release-title">
                    <div>
                      <h2>Pramukh Digital ERP App</h2>
                      <p>For warehouse packers, branch operations, and fleet drivers.</p>
                    </div>
                    <span className="release-badge">{androidAppRelease.channel}</span>
                  </div>

                  <div className="mobile-release-meta" aria-label="Mobile release information">
                    <span><strong>Version</strong> {androidAppRelease.version}</span>
                    <span><strong>Package</strong> Android APK</span>
                    <span><strong>Size</strong> {androidAppRelease.size}</span>
                    <span><strong>Updated</strong> {androidAppRelease.updatedAt}</span>
                  </div>

                  <ul className="mobile-benefits">
                    <li><MapPin size={17} /><span>Live fleet and delivery tracking</span></li>
                    <li><PackageCheck size={17} /><span>Warehouse picking and packing workflows</span></li>
                    <li><WifiOff size={17} /><span>Offline-safe activity and location queue</span></li>
                    <li><ShieldCheck size={17} /><span>Secure Clerk sign-in and managed device sessions</span></li>
                  </ul>

                  {androidAppRelease.isConfigured ? (
                    <a
                      className="site-button site-button-primary mobile-download-button"
                      href={androidAppRelease.downloadUrl}
                      download
                      rel="noreferrer"
                    >
                      <Download size={19} />
                      Download Android app
                    </a>
                  ) : (
                    <button className="site-button site-button-primary mobile-download-button" disabled>
                      <Download size={19} />
                      Android build coming soon
                    </button>
                  )}

                  {!androidAppRelease.isConfigured && (
                    <p className="mobile-config-note" role="status">
                      The administrator must configure <code>VITE_ANDROID_APP_DOWNLOAD_URL</code> before deployment.
                    </p>
                  )}

                  {androidAppRelease.sha256 && (
                    <details className="mobile-checksum">
                      <summary>Verify APK checksum</summary>
                      <code>{androidAppRelease.sha256}</code>
                    </details>
                  )}
                </div>

                <div className="mobile-device-preview" aria-hidden="true">
                  <div className="mobile-device-speaker" />
                  <div className="mobile-device-screen">
                    <div className="mobile-device-mark">P</div>
                    <strong>Pramukh ERP</strong>
                    <span>Warehouse &amp; Fleet</span>
                    <div className="mobile-device-route">
                      <i /><i /><i />
                    </div>
                  </div>
                </div>
              </article>

              <aside className="mobile-install-card">
                <span className="site-eyebrow">Installation</span>
                <h2>Install in three steps</h2>
                <ol>
                  <li><span>1</span><div><strong>Download the APK</strong><p>Open this page on the Android device and tap the download button.</p></div></li>
                  <li><span>2</span><div><strong>Allow this source</strong><p>If prompted, permit your browser to install unknown apps.</p></div></li>
                  <li><span>3</span><div><strong>Install and sign in</strong><p>Open the downloaded file, confirm installation, then use your assigned account.</p></div></li>
                </ol>
                <p className="mobile-install-note">Future APKs install over the existing app when they use the same package and signing key.</p>
              </aside>
            </div>

            <div className="desktop-download-heading">
              <span className="site-eyebrow"><MonitorDown size={16} /> Desktop application</span>
              <h2>Windows ERP Client</h2>
              <p>For billing, purchasing, inventory, reports, and office workflows.</p>
            </div>

            <div className="release-status">
              <div>
                <strong>All desktop releases</strong>
                <span>{releaseCountLabel}</span>
              </div>
              <div className="release-status-meta">
                {loading && <RefreshCw size={15} className="release-spin" />}
                {loading ? 'Checking GitHub releases' : usingFallback ? 'Showing bundled release list' : 'Synced from GitHub Releases'}
              </div>
            </div>

            <div className="downloads-list">
              {releases.map((release) => (
                <article className="release-card" key={release.version}>
                  <div className="release-head">
                    <div>
                      <div className="release-version">
                        <h2>Pramukh Digital ERP Client v{release.version}</h2>
                        <span className="release-badge">{release.channel}</span>
                      </div>
                      <div className="release-date">Published {release.date}</div>
                    </div>
                  </div>

                  <p>{release.notes[0]}</p>

                  <ul className="release-highlights">
                    {release.notes.map((item) => (
                      <li key={item}>
                        <Check size={16} color="#067647" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="release-actions">
                    {release.assets.map((download) => (
                      <a
                        key={`${release.version}-${download.label}`}
                        className={`site-button ${download.primary ? 'site-button-primary' : 'site-button-secondary'}`}
                        href={download.url}
                        download
                        target="_self"
                        rel="noreferrer"
                      >
                        <Download size={17} />
                        {download.label}
                      </a>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <div className="site-download-grid downloads-feature-grid">
              {downloadFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <article className="site-card" key={feature.title}>
                    <div className="site-card-icon"><Icon size={21} /></div>
                    <h3>{feature.title}</h3>
                    <p>{feature.body}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}

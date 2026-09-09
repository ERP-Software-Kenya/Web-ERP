import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Check, Download, MonitorDown, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import MarketingHeader from '../../marketing/components/MarketingHeader';
import MarketingFooter from '../../marketing/components/MarketingFooter';
import {
  downloadableAssetPattern,
  downloadFeatures,
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
                <MonitorDown size={16} />
                Desktop downloads
              </span>
              <h1 className="site-section-title">Download Pramukh Digital ERP Client</h1>
              <p className="site-section-copy">
                Get the latest desktop release for Windows, review previous builds, and keep a stable rollback path for your operations team.
              </p>
            </div>
          </div>
        </section>

        <section className="site-section">
          <div className="site-container">
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

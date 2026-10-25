import type { LucideIcon } from 'lucide-react';
import { MonitorDown, ShieldCheck, Sparkles } from 'lucide-react';

export interface DownloadAsset {
  label: string;
  platform: string;
  format: string;
  size: string;
  url: string;
  primary?: boolean;
}

export interface ErpClientRelease {
  version: string;
  tag: string;
  channel: 'Latest' | 'Previous';
  date: string;
  notes: string[];
  releaseUrl: string;
  assets: DownloadAsset[];
}

const githubReleaseBase = 'https://github.com/ERP-Software-Kenya/ERP-Client/releases';

export const githubReleasesApi = 'https://api.github.com/repos/ERP-Software-Kenya/ERP-Client/releases';
export const downloadableAssetPattern = /\.(exe|msi|dmg|appimage|deb|rpm|zip|tar\.gz)$/i;

export const erpClientReleases: ErpClientRelease[] = [
  {
    version: '0.1.9',
    tag: 'v0.1.9',
    channel: 'Latest',
    date: 'Current production client',
    releaseUrl: `${githubReleaseBase}/tag/0.1.9`,
    notes: [
      'Electron desktop ERP client for branch sales, purchase, inventory, reports, and analytics workflows.',
      'Published through the ERP-Client publish-release script to the public GitHub Releases channel.',
      'Recommended installer for production users on Windows x64.',
    ],
    assets: [
      {
        label: 'Download Windows Installer',
        platform: 'Windows x64',
        format: 'NSIS .exe',
        size: 'GitHub hosted',
        url: `${githubReleaseBase}/download/0.1.9/Pramukh-Digital-Setup-0.1.9.exe`,
        primary: true,
      },
    ],
  },
  {
    version: '0.1.8',
    tag: '0.1.8',
    channel: 'Previous',
    date: 'Previous production client',
    releaseUrl: `${githubReleaseBase}/tag/0.1.8`,
    notes: [
      'Previous Windows desktop build kept available as a rollback option.',
      'Use this only when operations need to return to ERP client v0.1.8.',
    ],
    assets: [
      {
        label: 'Download Windows Installer',
        platform: 'Windows x64',
        format: 'NSIS .exe',
        size: 'GitHub hosted',
        url: `${githubReleaseBase}/download/0.1.8/Pramukh-Digital-Setup-0.1.8.exe`,
        primary: true,
      },
    ],
  },
  {
    version: '0.1.7',
    tag: '0.1.7',
    channel: 'Previous',
    date: 'Previous production client',
    releaseUrl: `${githubReleaseBase}/tag/0.1.7`,
    notes: [
      'Previous Windows desktop build kept available as a rollback option.',
      'Use this only when operations need to return to the earlier ERP client version.',
    ],
    assets: [
      {
        label: 'Download Windows Installer',
        platform: 'Windows x64',
        format: 'NSIS .exe',
        size: 'GitHub hosted',
        url: `${githubReleaseBase}/download/0.1.7/Core-ERP-Client-Setup-0.1.7.exe`,
        primary: true,
      },
    ],
  },
  ...['0.1.6', '0.1.5', '0.1.4', '0.1.3', '0.1.2', '0.1.1'].map((version) => ({
    version,
    tag: version,
    channel: 'Previous' as const,
    date: 'Previous production client',
    releaseUrl: `${githubReleaseBase}/tag/${version}`,
    notes: [
      `Previous Windows desktop build v${version} kept available for rollback.`,
      'Use this only when operations need to return to an earlier ERP client version.',
    ],
    assets: [
      {
        label: 'Download Windows Installer',
        platform: 'Windows x64',
        format: 'NSIS .exe',
        size: 'GitHub hosted',
        url: `${githubReleaseBase}/download/${version}/Core-ERP-Client-Setup-${version}.exe`,
        primary: true,
      },
    ],
  })),
];

export const latestErpClientRelease = erpClientReleases[0];

const configuredAndroidUrl = import.meta.env.VITE_ANDROID_APP_DOWNLOAD_URL?.trim() ?? '';

export const androidAppRelease = {
  version: import.meta.env.VITE_ANDROID_APP_VERSION?.trim() || '1.0.0',
  channel: import.meta.env.VITE_MOBILE_RELEASE_CHANNEL?.trim() || 'stable',
  size: import.meta.env.VITE_ANDROID_APP_SIZE?.trim() || 'Size available after build',
  updatedAt: import.meta.env.VITE_ANDROID_APP_UPDATED_AT?.trim() || 'Latest approved build',
  sha256: import.meta.env.VITE_ANDROID_APP_SHA256?.trim() || '',
  downloadUrl: configuredAndroidUrl,
  isConfigured: /^https:\/\//i.test(configuredAndroidUrl),
} as const;

export const androidReleaseManifestUrl = import.meta.env.VITE_ANDROID_RELEASE_MANIFEST_URL?.trim() ?? '';

export interface AndroidReleaseManifest {
  application: 'erp-app';
  platform: 'android';
  channel: string;
  version: string;
  buildNumber: string;
  sizeBytes: number;
  sha256: string;
  publishedAt: string;
  downloadUrl: string;
}

export interface DownloadFeature {
  icon: LucideIcon;
  title: string;
  body: string;
}

export const downloadFeatures: DownloadFeature[] = [
  {
    icon: MonitorDown,
    title: 'Desktop speed',
    body: 'Run billing, inventory, purchase, and reports in a focused desktop workspace built for daily operations.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure updates',
    body: 'Release builds are published through the ERP Client GitHub Releases pipeline used by the desktop updater.',
  },
  {
    icon: Sparkles,
    title: 'Version control',
    body: 'Every listed build is easy to review, download, and roll back from a central downloads page.',
  },
];

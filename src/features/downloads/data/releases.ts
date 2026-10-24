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
    version: '1.1.0',
    tag: 'v1.1.0',
    channel: 'Latest',
    date: 'Current Production Release',
    releaseUrl: `${githubReleaseBase}/tag/v1.1.0`,
    notes: [
      'Official production desktop ERP client for branch sales, counter POS, stock transfer, purchase, and analytics.',
      'Validated for Windows 10 & 11 (64-bit). Direct hardware receipt printer & barcode scanner support.',
      'Recommended build for production retail stores, wholesalers, and multi-branch commercial enterprises.',
    ],
    assets: [
      {
        label: 'Download Pramukh Digital ERP (Windows x64)',
        platform: 'Windows x64',
        format: 'NSIS .exe',
        size: 'GitHub hosted',
        url: `${githubReleaseBase}/download/v1.1.0/Pramukh-Digital-Setup-1.1.0.exe`,
        primary: true,
      },
    ],
  },
  {
    version: '0.1.9',
    tag: 'v0.1.9',
    channel: 'Previous',
    date: 'Previous Release',
    releaseUrl: `${githubReleaseBase}/tag/0.1.9`,
    notes: [
      'Previous desktop ERP client build kept available as a rollback option for active teams.',
    ],
    assets: [
      {
        label: 'Download Windows Installer v0.1.9',
        platform: 'Windows x64',
        format: 'NSIS .exe',
        size: 'GitHub hosted',
        url: `${githubReleaseBase}/download/0.1.9/Pramukh-Digital-Setup-0.1.9.exe`,
        primary: false,
      },
    ],
  },
  {
    version: '0.1.8',
    tag: '0.1.8',
    channel: 'Previous',
    date: 'Previous Release',
    releaseUrl: `${githubReleaseBase}/tag/0.1.8`,
    notes: [
      'Rollback build kept available for operations needing to return to ERP client v0.1.8.',
    ],
    assets: [
      {
        label: 'Download Windows Installer v0.1.8',
        platform: 'Windows x64',
        format: 'NSIS .exe',
        size: 'GitHub hosted',
        url: `${githubReleaseBase}/download/0.1.8/Pramukh-Digital-Setup-0.1.8.exe`,
        primary: false,
      },
    ],
  },
];

export const latestErpClientRelease = erpClientReleases[0];

export interface DownloadFeature {
  icon: LucideIcon;
  title: string;
  body: string;
}

export const downloadFeatures: DownloadFeature[] = [
  {
    icon: MonitorDown,
    title: 'Counter & Desktop Speed',
    body: 'Fast thermal receipt printing, barcode lookup, and offline cache built for high-traffic store counters.',
  },
  {
    icon: ShieldCheck,
    title: 'Verified Security Pipeline',
    body: 'Release packages are compiled and distributed through GitHub Releases with SHA256 integrity verification.',
  },
  {
    icon: Sparkles,
    title: 'Automatic Cloud Sync',
    body: 'Branch transactions sync securely with your cloud workspace so management has 360-degree visibility.',
  },
];

import { useState, useEffect } from 'react';

const GITHUB_API = 'https://api.github.com/repos/ERP-Software-Kenya/ERP-Client/releases/latest';
const GITHUB_RELEASES = 'https://github.com/ERP-Software-Kenya/ERP-Client/releases/latest';

export interface ReleaseInfo {
  version: string;
  name: string;
  downloadUrl: string | null;
  releasesUrl: string;
  loading: boolean;
}

export function useLatestRelease(): ReleaseInfo & { handleDownload: () => void } {
  const [state, setState] = useState<ReleaseInfo>({
    version: '',
    name: '',
    downloadUrl: null,
    releasesUrl: GITHUB_RELEASES,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;
    fetch(GITHUB_API)
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        const exeAsset = data.assets?.find((a: any) => a.name.endsWith('.exe'));
        setState({
          version: data.tag_name || 'Latest',
          name: data.name || 'Latest Release',
          downloadUrl: exeAsset?.browser_download_url ?? null,
          releasesUrl: GITHUB_RELEASES,
          loading: false,
        });
      })
      .catch(() => {
        if (cancelled) return;
        setState(prev => ({ ...prev, version: 'Latest', loading: false }));
      });
    return () => { cancelled = true; };
  }, []);

  const handleDownload = () => {
    if (state.downloadUrl) {
      window.location.href = state.downloadUrl;
    } else {
      window.open(GITHUB_RELEASES, '_blank');
    }
  };

  return { ...state, handleDownload };
}

import type { Clerk } from '@clerk/clerk-js';

const API_URL = (import.meta.env.VITE_API_BASE_URL || 'https://core-apis-m03n.onrender.com').replace(/\/$/, '');

export type BackendMe = {
  id: string | null;
  clerkUserId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
  isOnboarded: boolean;
  organization?: { id: string; name?: string; slug?: string };
};

export type OrganizationOnboardingResult = {
  organizationId: string;
  organizationName: string;
  membershipId: string;
  role: string;
};

export type MobileReleaseMetadata = {
  application: 'erp-app';
  platform: 'android';
  channel: string;
  version: string;
  buildNumber: string;
  sizeBytes: number;
  sha256: string;
  publishedAt: string;
  gitCommit?: string | null;
  easBuildId?: string | null;
};

export type MobileReleaseDownload = {
  url: string;
  expiresAt: string;
};

async function authenticatedRequest<T>(clerk: Clerk, path: string, init: RequestInit = {}): Promise<T> {
  const token = await clerk.session?.getToken({ skipCache: true });
  if (!token) throw new Error('Your Clerk session is not active. Please sign in again.');
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...init.headers,
    },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => undefined) as { message?: string } | undefined;
    throw new Error(body?.message || `Server request failed (${response.status})`);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export async function synchronizeUser(clerk: Clerk): Promise<BackendMe> {
  await authenticatedRequest(clerk, '/api/v1/auth/sync', { method: 'POST' });
  return authenticatedRequest<BackendMe>(clerk, '/api/v1/auth/me');
}

export function onboardOrganization(
  clerk: Clerk,
  input: { name: string; slug: string; clerkOrgId: string; country?: string },
): Promise<OrganizationOnboardingResult> {
  return authenticatedRequest(clerk, '/api/v1/auth/organizations', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function getLatestMobileRelease(): Promise<MobileReleaseMetadata> {
  const response = await fetch(`${API_URL}/api/v1/mobile-releases/latest`, {
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => undefined) as { message?: string } | undefined;
    throw new Error(body?.message || `Server request failed (${response.status})`);
  }
  return response.json() as Promise<MobileReleaseMetadata>;
}

export async function createMobileReleaseDownload(): Promise<MobileReleaseDownload> {
  const response = await fetch(`${API_URL}/api/v1/mobile-releases/latest/download`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => undefined) as { message?: string } | undefined;
    throw new Error(body?.message || `Server request failed (${response.status})`);
  }
  return response.json() as Promise<MobileReleaseDownload>;
}

import { isDevelopment } from '@/lib/utils';
import { IUser } from '@/types';

const API_BASE = isDevelopment
  ? import.meta.env.VITE_DEVELOPMENT_API
  : import.meta.env.VITE_PRODUCTION_API;

export function getGoogleCallbackUrl(): string {
  const appUrl = (import.meta.env.VITE_APP_URL as string | undefined)?.replace(/\/$/, '');
  return `${appUrl || window.location.origin}/auth/google/callback`;
}

export function startGoogleSignIn(): void {
  const redirectTo = getGoogleCallbackUrl();
  const url = `${API_BASE}/api/auth/google?redirect_to=${encodeURIComponent(redirectTo)}`;
  window.location.href = url;
}

export interface GoogleCallbackResult {
  user?: IUser;
  error?: string;
}

export function parseGoogleCallback(location: Location): GoogleCallbackResult | null {
  const raw = location.hash.startsWith('#') ? location.hash.slice(1) : location.search.slice(1);
  if (!raw) return null;

  const params = new URLSearchParams(raw);
  const error = params.get('error');
  const userRaw = params.get('user');

  if (error) {
    return { error };
  }

  if (!userRaw) {
    return null;
  }

  try {
    const user = JSON.parse(userRaw) as IUser;
    if (!user._id || !user.token) {
      return null;
    }
    return { user };
  } catch {
    return null;
  }
}

export function clearOAuthHash(): void {
  const path = window.location.pathname + window.location.search;
  window.history.replaceState(null, '', path);
}

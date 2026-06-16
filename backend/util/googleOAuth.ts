import jwt from "jsonwebtoken";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

export interface GoogleUserInfo {
  sub: string;
  email: string;
  name: string;
  email_verified: boolean;
  picture?: string;
}

interface OAuthStatePayload {
  redirectTo: string;
}

interface GoogleTokenResponse {
  access_token: string;
  id_token?: string;
  token_type: string;
  expires_in: number;
}

const getGoogleConfig = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return null;
  }

  return { clientId, clientSecret, redirectUri };
};

export const isGoogleAuthConfigured = () => getGoogleConfig() !== null;

export const encodeOAuthState = (redirectTo: string): string => {
  return jwt.sign({ redirectTo } satisfies OAuthStatePayload, process.env.SECRET as string, {
    expiresIn: "10m",
  });
};

export const decodeOAuthState = (state: string): OAuthStatePayload => {
  return jwt.verify(state, process.env.SECRET as string) as OAuthStatePayload;
};

export const getGoogleAuthorizationUrl = (state: string): string => {
  const config = getGoogleConfig();
  if (!config) {
    throw new Error("Google OAuth is not configured");
  }

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "online",
    prompt: "select_account",
    state,
  });

  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
};

export const exchangeGoogleCode = async (code: string): Promise<GoogleUserInfo> => {
  const config = getGoogleConfig();
  if (!config) {
    throw new Error("Google OAuth is not configured");
  }

  const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: config.redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenResponse.ok) {
    throw new Error("Google token exchange failed");
  }

  const tokens = (await tokenResponse.json()) as GoogleTokenResponse;

  const userInfoResponse = await fetch(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });

  if (!userInfoResponse.ok) {
    throw new Error("Failed to fetch Google user info");
  }

  const userInfo = (await userInfoResponse.json()) as GoogleUserInfo;

  if (!userInfo.email_verified) {
    throw new Error("Google email is not verified");
  }

  return userInfo;
};

export const buildOAuthSuccessRedirect = (
  redirectTo: string,
  userPayload: Record<string, unknown>
): string => {
  const params = new URLSearchParams();
  params.set("user", JSON.stringify(userPayload));
  return `${redirectTo}#${params.toString()}`;
};

export const buildOAuthErrorRedirect = (redirectTo: string, message: string): string => {
  const params = new URLSearchParams();
  params.set("error", message);
  return `${redirectTo}#${params.toString()}`;
};

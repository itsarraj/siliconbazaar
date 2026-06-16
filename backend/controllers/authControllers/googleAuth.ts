import asyncHandler from "express-async-handler";
import {
  createUser,
  findUserByEmail,
  findUserByGoogleId,
  updateUser,
} from "../../lib/repositories.js";
import getToken from "../../util/getToken.js";
import { serializeUser } from "../../lib/serializers.js";
import {
  buildOAuthErrorRedirect,
  buildOAuthSuccessRedirect,
  decodeOAuthState,
  encodeOAuthState,
  exchangeGoogleCode,
  getGoogleAuthorizationUrl,
  isGoogleAuthConfigured,
} from "../../util/googleOAuth.js";

export const findOrCreateGoogleUser = async (googleUser: {
  sub: string;
  email: string;
  name: string;
}) => {
  const byGoogleId = await findUserByGoogleId(googleUser.sub);
  if (byGoogleId) {
    return byGoogleId;
  }

  const byEmail = await findUserByEmail(googleUser.email.toLowerCase());
  if (byEmail) {
    return updateUser(byEmail.id, {
      googleId: googleUser.sub,
      authProvider: "google",
      name: byEmail.name || googleUser.name,
    });
  }

  return createUser({
    name: googleUser.name,
    email: googleUser.email.toLowerCase(),
    googleId: googleUser.sub,
    authProvider: "google",
    isAdmin: false,
  });
};

export const toAuthResponse = (user: Awaited<ReturnType<typeof findOrCreateGoogleUser>>) => ({
  ...serializeUser(user),
  token: getToken(user.id),
});

export const googleRedirect = asyncHandler(async (req, res) => {
  const redirectTo =
    (req.query.redirect_to as string) ||
    process.env.DEVELOPMENT_CLIENT_ORIGIN ||
    process.env.PRODUCTION_CLIENT_ORIGIN;

  if (!redirectTo) {
    res.status(400).json({ message: "redirect_to is required" });
    return;
  }

  if (!isGoogleAuthConfigured()) {
    res.status(503).json({ message: "Google sign-in is not configured on this server" });
    return;
  }

  const state = encodeOAuthState(redirectTo);
  const authUrl = getGoogleAuthorizationUrl(state);
  res.redirect(authUrl);
});

export const googleCallback = asyncHandler(async (req, res) => {
  const code = req.query.code as string | undefined;
  const state = req.query.state as string | undefined;
  const oauthError = req.query.error as string | undefined;

  let redirectTo =
    process.env.DEVELOPMENT_CLIENT_ORIGIN ||
    process.env.PRODUCTION_CLIENT_ORIGIN ||
    "";

  if (state) {
    try {
      ({ redirectTo } = decodeOAuthState(state));
    } catch {
      res.status(400).json({ message: "Invalid OAuth state" });
      return;
    }
  }

  if (oauthError) {
    res.redirect(buildOAuthErrorRedirect(redirectTo, "Google sign-in was cancelled"));
    return;
  }

  if (!isGoogleAuthConfigured()) {
    res.redirect(buildOAuthErrorRedirect(redirectTo, "Google sign-in is not configured"));
    return;
  }

  if (!code || !state) {
    res.redirect(buildOAuthErrorRedirect(redirectTo, "Missing Google authorization code"));
    return;
  }

  try {
    const googleUser = await exchangeGoogleCode(code);
    const user = await findOrCreateGoogleUser(googleUser);
    const payload = toAuthResponse(user);
    res.redirect(buildOAuthSuccessRedirect(redirectTo, payload));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to complete Google sign-in";
    res.redirect(buildOAuthErrorRedirect(redirectTo, message));
  }
});

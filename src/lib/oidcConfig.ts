/**
 * OIDC Configuration
 * 
 * Configure your Identity Provider (IdP) settings here.
 * These values should ideally come from environment variables in production.
 */

export interface OIDCConfig {
  clientId: string;
  clientSecret?: string;
  authorizationEndpoint: string;
  tokenEndpoint: string;
  redirectUri: string;
  scope: string;
  issuer: string;
}

/**
 * Get OIDC configuration from environment or defaults
 * 
 * To configure, set these environment variables:
 * - VITE_OIDC_CLIENT_ID
 * - VITE_OIDC_CLIENT_SECRET
 * - VITE_OIDC_AUTHORIZATION_ENDPOINT
 * - VITE_OIDC_TOKEN_ENDPOINT
 * - VITE_OIDC_ISSUER
 * - VITE_OIDC_SCOPE (optional, defaults to 'openid profile email')
 */
export function getOIDCConfig(): OIDCConfig {
  const clientId = import.meta.env.VITE_OIDC_CLIENT_ID || '';
  const clientSecret = import.meta.env.VITE_OIDC_CLIENT_SECRET || '';
  const authorizationEndpoint = import.meta.env.VITE_OIDC_AUTHORIZATION_ENDPOINT || '';
  const tokenEndpoint = import.meta.env.VITE_OIDC_TOKEN_ENDPOINT || '';
  const issuer = import.meta.env.VITE_OIDC_ISSUER || '';
  const scope = import.meta.env.VITE_OIDC_SCOPE || 'openid profile email';
  
  // Redirect URI is dynamically generated based on current origin
  const redirectUri = `${window.location.origin}/auth/callback`;
  
  return {
    clientId,
    clientSecret: clientSecret || undefined,
    authorizationEndpoint,
    tokenEndpoint,
    redirectUri,
    scope,
    issuer,
  };
}

/**
 * Check if OIDC is properly configured
 */
export function isOIDCConfigured(): boolean {
  const config = getOIDCConfig();
  return !!(
    config.clientId &&
    config.authorizationEndpoint &&
    config.tokenEndpoint &&
    config.issuer
  );
}

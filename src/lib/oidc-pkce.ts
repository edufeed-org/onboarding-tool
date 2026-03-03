/**
 * OIDC PKCE Utilities for browser-based authentication
 * Implements PKCE (Proof Key for Code Exchange) for secure OAuth 2.0 flows in SPAs
 */

/**
 * Converts an ArrayBuffer to a base64url-encoded string
 * @param buffer - The buffer to encode
 * @returns base64url-encoded string (RFC 4648)
 */
function base64urlEncode(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Generates a cryptographically secure random string for use as code_verifier
 * @returns A random string suitable for PKCE code_verifier
 */
function generateRandomString(length: number = 64): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return base64urlEncode(array.buffer).slice(0, length);
}

/**
 * Generates a PKCE code_verifier and code_challenge pair
 * @returns Object containing code_verifier and code_challenge
 */
export async function generateCodeChallengePair(): Promise<{
  code_verifier: string;
  code_challenge: string;
}> {
  // Generate secure random verifier
  const verifier = generateRandomString(64);
  
  // Create SHA-256 hash of verifier
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  
  // Encode as base64url
  const challenge = base64urlEncode(digest);
  
  return {
    code_verifier: verifier,
    code_challenge: challenge,
  };
}

/**
 * Parses a JWT token and returns the payload
 * WARNING: This does NOT verify the signature. Only use for trusted sources
 * or implement proper JWT verification separately.
 * @param token - JWT token string
 * @returns Decoded payload object
 */
export function parseJwt(token: string): Record<string, unknown> {
  try {
    const [, payload] = token.split('.');
    if (!payload) {
      throw new Error('Invalid JWT format');
    }
    
    // Base64url decode
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Failed to parse JWT:', error);
    throw new Error('Invalid JWT token');
  }
}

/**
 * Validates basic JWT claims (iss, aud, exp)
 * @param claims - Decoded JWT claims
 * @param expectedIssuer - Expected issuer value
 * @param expectedAudience - Expected audience value
 * @returns true if valid, throws error otherwise
 */
export function validateJwtClaims(
  claims: Record<string, unknown>,
  expectedIssuer: string,
  expectedAudience: string
): boolean {
  // Check issuer
  if (claims.iss !== expectedIssuer) {
    throw new Error(`Invalid issuer. Expected ${expectedIssuer}, got ${claims.iss}`);
  }
  
  // Check audience
  if (claims.aud !== expectedAudience) {
    throw new Error(`Invalid audience. Expected ${expectedAudience}, got ${claims.aud}`);
  }
  
  // Check expiration
  const exp = claims.exp as number;
  if (!exp || Date.now() >= exp * 1000) {
    throw new Error('Token has expired');
  }
  
  return true;
}

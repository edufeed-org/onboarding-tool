import { useNostr } from '@nostrify/react';
import { NLogin, useNostrLogin } from '@nostrify/react/login';
import { generateCodeChallengePair } from '@/lib/oidc-pkce';
import { getOIDCConfig } from '@/lib/oidcConfig';

// NOTE: This file should not be edited except for adding new login methods.

export function useLoginActions() {
  const { nostr } = useNostr();
  const { logins, addLogin, removeLogin } = useNostrLogin();

  return {
    // Login with a Nostr secret key
    nsec(nsec: string): void {
      const login = NLogin.fromNsec(nsec);
      addLogin(login);
    },
    // Login with a NIP-46 "bunker://" URI
    async bunker(uri: string): Promise<void> {
      const login = await NLogin.fromBunker(uri, nostr);
      addLogin(login);
    },
    // Login with a NIP-07 browser extension
    async extension(): Promise<void> {
      const login = await NLogin.fromExtension();
      addLogin(login);
    },
    // Login with OIDC (OpenID Connect with PKCE)
    async oidc(): Promise<void> {
      const config = getOIDCConfig();
      
      // Generate PKCE challenge
      const { code_verifier, code_challenge } = await generateCodeChallengePair();
      
      // Store verifier temporarily in sessionStorage (will be used in callback)
      sessionStorage.setItem('oidc_pkce_verifier', code_verifier);
      sessionStorage.setItem('oidc_state', crypto.randomUUID());
      
      // Build authorization URL
      const params = new URLSearchParams({
        client_id: config.clientId,
        response_type: 'code',
        scope: config.scope,
        redirect_uri: config.redirectUri,
        code_challenge_method: 'S256',
        code_challenge,
        state: sessionStorage.getItem('oidc_state') || '',
      });
      
      // Redirect to IdP
      window.location.href = `${config.authorizationEndpoint}?${params.toString()}`;
    },
    // Log out the current user
    async logout(): Promise<void> {
      const login = logins[0];
      if (login) {
        removeLogin(login.id);
      }
    }
  };
}

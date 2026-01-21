import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NLogin, useNostrLogin } from '@nostrify/react/login';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { parseJwt, validateJwtClaims } from '@/lib/oidc-pkce';
import { getOIDCConfig } from '@/lib/oidcConfig';

/**
 * OIDCCallbackPage
 * 
 * Handles the OAuth 2.0 / OIDC callback after user authenticates with IdP.
 * Exchanges authorization code for tokens and logs user in.
 * 
 * Security notes:
 * - Never persists nsec to localStorage/IndexedDB
 * - Only stores npub (public key) permanently
 * - nsec kept only in memory via NLogin if provided by IdP
 */
export default function OIDCCallbackPage() {
  const navigate = useNavigate();
  const { addLogin } = useNostrLogin();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Extract authorization code and state from URL
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const state = params.get('state');
        const error = params.get('error');
        const errorDescription = params.get('error_description');

        // Check for OAuth errors
        if (error) {
          throw new Error(errorDescription || error);
        }

        if (!code) {
          throw new Error('Autorisierungscode fehlt in der Callback-URL');
        }

        // Verify state to prevent CSRF
        const storedState = sessionStorage.getItem('oidc_state');
        if (state !== storedState) {
          throw new Error('Ungültiger State-Parameter - möglicher CSRF-Angriff');
        }

        // Get stored PKCE verifier
        const codeVerifier = sessionStorage.getItem('oidc_pkce_verifier');
        if (!codeVerifier) {
          throw new Error('PKCE-Verifier nicht gefunden - bitte erneut anmelden');
        }

        // Get OIDC configuration
        const config = getOIDCConfig();

        // Exchange authorization code for tokens
        const tokenBody = new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: config.redirectUri,
          client_id: config.clientId,
          code_verifier: codeVerifier,
        });

        const tokenResponse = await fetch(config.tokenEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: tokenBody.toString(),
        });

        if (!tokenResponse.ok) {
          const errorData = await tokenResponse.json().catch(() => ({}));
          throw new Error(
            errorData.error_description || 
            errorData.error || 
            `Token-Exchange fehlgeschlagen: ${tokenResponse.status}`
          );
        }

        const tokens = await tokenResponse.json();
        
        if (!tokens.id_token) {
          throw new Error('Kein ID-Token in der Antwort erhalten');
        }

        // Parse and validate ID token
        const idClaims = parseJwt(tokens.id_token);
        validateJwtClaims(idClaims, config.issuer, config.clientId);

        // Extract Nostr credentials from claims
        const npub = idClaims.npub as string | undefined;
        const nsec = idClaims.nsec as string | undefined;

        if (!npub && !nsec) {
          throw new Error('Keine Nostr-Credentials (npub/nsec) in den Token-Claims gefunden');
        }

        // Create login - prefer nsec if available (kept in memory only)
        // Otherwise use npub (will require external signer for signing)
        let login: NLogin;
        if (nsec) {
          // SECURITY: nsec is kept in memory only via NLogin
          // It is never persisted to localStorage/IndexedDB
          login = NLogin.fromNsec(nsec);
        } else if (npub) {
          // Only public key available - will need NIP-07 or NIP-46 for signing
          // Store npub in a way that requires external signing
          throw new Error('Nur npub bereitgestellt - externe Signer-Unterstützung noch nicht implementiert');
        } else {
          throw new Error('Keine gültigen Nostr-Credentials gefunden');
        }

        // Add login (this stores only npub permanently, nsec stays in memory)
        addLogin(login);

        // Clean up session storage
        sessionStorage.removeItem('oidc_pkce_verifier');
        sessionStorage.removeItem('oidc_state');

        setStatus('success');

        // Redirect to home page after short delay
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 1500);

      } catch (err) {
        console.error('OIDC callback error:', err);
        setError(err instanceof Error ? err.message : 'Unbekannter Fehler bei der Anmeldung');
        setStatus('error');

        // Clean up session storage on error
        sessionStorage.removeItem('oidc_pkce_verifier');
        sessionStorage.removeItem('oidc_state');
      }
    };

    handleCallback();
  }, [navigate, addLogin]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/20">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>SSO Anmeldung</CardTitle>
          <CardDescription>
            {status === 'loading' && 'Authentifizierung wird verarbeitet...'}
            {status === 'success' && 'Anmeldung erfolgreich!'}
            {status === 'error' && 'Anmeldung fehlgeschlagen'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'loading' && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Tokens werden ausgetauscht und verifiziert...
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <CheckCircle className="w-12 h-12 text-green-500" />
              <p className="text-sm text-muted-foreground">
                Sie werden weitergeleitet...
              </p>
            </div>
          )}

          {status === 'error' && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-semibold">Fehler bei der Anmeldung:</p>
                  <p className="text-sm">{error}</p>
                  <p className="text-sm mt-4">
                    Bitte{' '}
                    <button
                      onClick={() => navigate('/', { replace: true })}
                      className="underline hover:no-underline"
                    >
                      kehren Sie zur Startseite zurück
                    </button>
                    {' '}und versuchen Sie es erneut.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

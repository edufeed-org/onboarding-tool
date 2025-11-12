"use client";

import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { initKeycloak } from "@/lib/keycloak/keycloak-auth";

interface NostrKeys {
  nsec: string;
  npub: string;
}

// Environment variables from .env
const ENABLE_KEYCLOAK_SYNC = process.env.NEXT_PUBLIC_ENABLE_KEYCLOAK_SYNC === "true";
const KEYCLOAK_INSTANCE_URL = process.env.NEXT_PUBLIC_KEYCLOAK_INSTANCE_URL || "";

export default function KeycloakSync() {
  const [keys, setKeys] = useState<NostrKeys | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginInProgress, setLoginInProgress] = useState(false);
  const [syncInProgress, setSyncInProgress] = useState(false);
  const [syncComplete, setSyncComplete] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const router = useRouter();

  // Load keys from localStorage and check authentication status on component mount
  useEffect(() => {
    try {
      const savedKeys = localStorage.getItem("nostr-keys");
      if (savedKeys) {
        setKeys(JSON.parse(savedKeys));
      } else {
        // If no keys found, redirect to previous page
        router.push("/download");
      }
    } catch (error) {
      console.error("Failed to load keys from localStorage:", error);
      router.push("/download");
    }

    // If Keycloak sync is not enabled, skip this step
    if (!ENABLE_KEYCLOAK_SYNC || !KEYCLOAK_INSTANCE_URL) {
      router.push("/done");
    }

    // Check if user is already authenticated with Keycloak
    const checkAuthStatus = async () => {
      try {
        const keycloak = initKeycloak();
        const authenticated = await keycloak.init({
          checkLoginIframe: false,
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
          pkceMethod: 'S256',
        });

        if (authenticated && keycloak.token) {
          console.log('User is already authenticated');
          setAccessToken(keycloak.token);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        // Don't show error to user since this is just an initial check
      }
    };

    checkAuthStatus();
  }, [router]);

  // Handle Keycloak login
  const handleLogin = async () => {
    try {
      setLoginInProgress(true);
      setSyncError(null);

      const keycloak = initKeycloak();
      
      // Set up redirect login flow with immediate redirect
      await keycloak.login({
        redirectUri: window.location.href,
        prompt: 'login' // Force login screen even if already authenticated
      });
      
      // The code below won't execute because the page will be redirected to Keycloak
      // When the user returns, the useEffect with checkAuthStatus will detect the authentication
      
    } catch (error: unknown) {
      console.error("Failed to login to Keycloak:", error);
      setSyncError(
        error instanceof Error ? error.message : 
        "Anmeldung bei Keycloak fehlgeschlagen. Bitte versuche es später erneut."
      );
      setLoginInProgress(false);
    }
  };

  // Handle Keycloak sync
  const handleSync = async () => {
    if (!keys?.nsec || !keys?.npub || !accessToken) return;

    try {
      setSyncInProgress(true);
      setSyncError(null);

      // Call API route directly with the token we already have
      const response = await fetch('/api/keycloak-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nsec: keys.nsec,
          npub: keys.npub,
          accessToken,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to sync keys with Keycloak');
      }
      
      // Set sync as complete
      setSyncComplete(true);
      
      // Wait a moment before redirecting
      setTimeout(() => {
        router.push("/done");
      }, 2000);
      
    } catch (error: unknown) {
      console.error("Failed to sync with Keycloak:", error);
      setSyncError(
        error instanceof Error ? error.message : 
        "Synchronisation mit Keycloak fehlgeschlagen. Bitte versuche es später erneut."
      );
    } finally {
      setSyncInProgress(false);
    }
  };

  const skipSync = () => {
    router.push("/done");
  };

  // If Keycloak sync is disabled, don't render this page
  if (!ENABLE_KEYCLOAK_SYNC || !KEYCLOAK_INSTANCE_URL) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header with theme toggle */}
      <header className="w-full p-4 md:p-6 flex justify-end">
        <div className="absolute top-4 right-4 md:top-6 md:right-6">
          <ThemeToggle />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col p-6 md:p-12 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:gap-12 w-full">
          {/* Left side - Text content */}
          <div className="w-full md:w-1/2 space-y-6 mb-12 md:mb-0">
            {/* Heading */}
            <div className="space-y-2 relative pl-0 md:pl-6 flex flex-col">
              <div className="hidden md:block absolute left-0 top-0 bottom-0 w-1.5 bg-primary rounded-full"></div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                <span className="text-muted-foreground">KEY-</span><br />
                <span>CLOAK</span>
              </h1>
            </div>

            {/* Explanatory text */}
            <div className="space-y-5 text-base md:text-lg">
              <p>
                Jetzt hast du die Möglichkeit, deinen <span className="font-mono">nsec</span> mit 
                einer zentralen Identitätsmanagement-Lösung namens <strong>Keycloak</strong> zu synchronisieren.
              </p>
              
              <p>
                Dies gibt dir eine zusätzliche Sicherheitsebene und ermöglicht 
                dir den Zugriff auf deinen Nostr-Schlüssel über verschiedene 
                vertrauenswürdige Dienste.
              </p>
              
              <p>
                Falls du jemals deinen Zugriff verlierst oder dein Gerät wechselst, 
                kannst du über Keycloak wieder Zugriff auf deinen <span className="font-mono">nsec</span> erhalten.
              </p>
              
              <p>
                Diese Integration ist vollständig optional und kann übersprungen werden.
              </p>
            </div>
          </div>

          {/* Right side - Sync form */}
          <div className="w-full md:w-1/2 space-y-8 flex flex-col items-center justify-center">
            <div className="w-full max-w-md space-y-6 bg-muted/20 p-8 rounded-lg border border-muted">
              <div className="flex justify-center mb-4">
                <Image
                  src="/globe.svg"
                  alt="Keycloak Logo"
                  width={80}
                  height={80}
                  className="opacity-80"
                />
              </div>

              <div className="space-y-4 text-center">
                <h3 className="text-xl font-medium">
                  Keycloak-Synchronisation
                </h3>
                <p className="text-muted-foreground text-sm">
                  Synchronisiere deinen Nostr-Schlüssel mit Keycloak unter:
                  <br />
                  <span className="font-mono text-xs mt-1 block truncate">
                    {KEYCLOAK_INSTANCE_URL}
                  </span>
                </p>
              </div>

              <div className="flex flex-col space-y-4">
                <div className="pt-4 space-y-3">
                  <Button 
                    onClick={handleLogin}
                    disabled={loginInProgress || isLoggedIn}
                    className="w-full"
                  >
                    {loginInProgress ? "Anmeldung läuft..." : 
                     isLoggedIn ? "Angemeldet ✓" : "Bei Keycloak anmelden"}
                  </Button>
                  
                  <Button 
                    onClick={handleSync}
                    disabled={!isLoggedIn || syncInProgress || syncComplete}
                    className="w-full"
                  >
                    {syncInProgress ? "Synchronisierung läuft..." : 
                     syncComplete ? "Synchronisiert ✓" : "Schlüssel synchronisieren"}
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={skipSync}
                    disabled={syncInProgress || loginInProgress}
                    className="w-full"
                  >
                    Nein danke, fortfahren →
                  </Button>
                </div>

                {syncError && (
                  <p className="text-sm text-destructive mt-2">{syncError}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

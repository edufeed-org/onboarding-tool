'use client';

import Keycloak from 'keycloak-js';

let keycloakInstance: Keycloak | null = null;

export const initKeycloak = () => {
  if (!keycloakInstance) {
    // Get the base URL without trailing slashes
    let baseUrl = (process.env.NEXT_PUBLIC_KEYCLOAK_INSTANCE_URL || '').trim();
    if (baseUrl.endsWith('/')) {
      baseUrl = baseUrl.slice(0, -1);
    }
    
    // Handle both modern Keycloak (without /auth) and legacy Keycloak (with /auth)
    // by checking if /auth is already in the URL
    const url = baseUrl.endsWith('/auth') ? baseUrl : baseUrl;
    
    const keycloakConfig = {
      url,
      realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || '',
      clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || '',
    };

    console.log('Initializing Keycloak with URL:', url);
    keycloakInstance = new Keycloak(keycloakConfig);
  }
  
  return keycloakInstance;
};

// Returns a promise that resolves with the authenticated instance
export const authenticateWithKeycloak = async (): Promise<Keycloak> => {
  const keycloak = initKeycloak();
  
  try {
    console.log('Attempting to authenticate with Keycloak...');
    
    const authenticated = await keycloak.init({
      onLoad: 'login-required',
      checkLoginIframe: false,
      pkceMethod: 'S256', // Use PKCE for enhanced security
    });

    if (!authenticated) {
      console.error('Keycloak initialization completed but user is not authenticated');
      throw new Error('Authentication failed');
    }

    console.log('Successfully authenticated with Keycloak');
    return keycloak;
  } catch (error) {
    // Log detailed error information
    console.error('Failed to initialize Keycloak:', error);
    
    // Check if we have a specific error message
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Provide more context in the error
    throw new Error(`Keycloak authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Sync nostr keys with Keycloak
export const syncNostrKeysWithKeycloak = async (nsec: string, npub: string): Promise<boolean> => {
  try {
    console.log('Starting Nostr key synchronization with Keycloak');
    
    // Authenticate with Keycloak
    const keycloak = await authenticateWithKeycloak();
    
    // Get the access token
    const accessToken = keycloak.token;
    
    if (!accessToken) {
      console.error('Authentication successful but no access token available');
      throw new Error('No access token available');
    }

    console.log('Received access token, calling API route for key synchronization');
    console.log(accessToken);
    
    // Call the API route to sync the keys
    const response = await fetch('/api/keycloak-sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nsec,
        npub,
        accessToken,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        // If the error response is not valid JSON
        console.error('Server returned non-JSON error response:', errorText);
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
      
      console.error('API route returned error:', errorData);
      throw new Error(errorData.error || 'Failed to sync keys with Keycloak');
    }

    console.log('Successfully synced Nostr keys with Keycloak');
    return true;
  } catch (error) {
    console.error('Error syncing keys with Keycloak:', error);
    
    // Add more context to the error message
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    throw error;
  }
};

// Logout from Keycloak
export const logoutFromKeycloak = () => {
  const keycloak = initKeycloak();
  if (keycloak.authenticated) {
    keycloak.logout();
  }
};
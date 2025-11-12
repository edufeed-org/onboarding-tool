import { NextRequest, NextResponse } from 'next/server';
import * as crypto from 'crypto';

// Environment variables
const KEYCLOAK_BASE_URL = process.env.KEYCLOAK_URL || process.env.NEXT_PUBLIC_KEYCLOAK_INSTANCE_URL || '';
// Ensure the URL doesn't have a trailing slash
const KEYCLOAK_URL = KEYCLOAK_BASE_URL.endsWith('/') ? KEYCLOAK_BASE_URL.slice(0, -1) : KEYCLOAK_BASE_URL;
const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM || '';
const KEYCLOAK_CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID || '';
const KEYCLOAK_CLIENT_SECRET = process.env.KEYCLOAK_CLIENT_SECRET || '';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '';

// Function to encrypt the NSEC key before storing it
function encryptNsec(nsec: string): string {
  if (!ENCRYPTION_KEY) {
    console.warn('ENCRYPTION_KEY not set. Using plaintext storage which is NOT recommended for production.');
    return nsec;
  }

  try {
    // Generate a random initialization vector
    const iv = crypto.randomBytes(16);
    
    // Create a cipher using AES-256-GCM which provides authenticated encryption
    const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    
    // Encrypt the NSEC
    let encrypted = cipher.update(nsec, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Get the auth tag
    const authTag = cipher.getAuthTag();
    
    // Return IV + encrypted data + auth tag as base64 string
    return Buffer.from(iv.toString('hex') + encrypted + authTag.toString('hex')).toString('base64');
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt NSEC key');
  }
}

// Handle synchronization of NSEC to Keycloak
export async function POST(req: NextRequest) {
  try {
    // Get the request body containing the keys
    const body = await req.json();
    const { nsec, npub, accessToken } = body;

    if (!nsec || !npub || !accessToken) {
      return NextResponse.json(
        { error: 'Missing required data (nsec, npub, or accessToken)' }, 
        { status: 400 }
      );
    }

    // Validate required environment variables
    if (!KEYCLOAK_URL || !KEYCLOAK_REALM || !KEYCLOAK_CLIENT_ID) {
      return NextResponse.json(
        { error: 'Keycloak configuration is incomplete. Check server environment variables.' }, 
        { status: 500 }
      );
    }

    // Encrypt the NSEC key
    const encryptedNsec = encryptNsec(nsec);

    // Get user information from Keycloak to get the user ID
    const userInfoResponse = await fetch(
      `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/userinfo`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!userInfoResponse.ok) {
      const errorText = await userInfoResponse.text();
      console.error('Failed to get user info:', errorText);
      return NextResponse.json(
        { error: 'Failed to authenticate with Keycloak' }, 
        { status: userInfoResponse.status }
      );
    }

    const userInfo = await userInfoResponse.json();
    const userId = userInfo.sub;

    // Prepare a service account token to access Keycloak Admin API
    const tokenResponse = await fetch(
      `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: KEYCLOAK_CLIENT_ID,
          client_secret: KEYCLOAK_CLIENT_SECRET,
        }),
      }
    );

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Failed to get admin token:', errorText);
      return NextResponse.json(
        { error: 'Failed to authenticate service account with Keycloak' }, 
        { status: tokenResponse.status }
      );
    }

    const tokenData = await tokenResponse.json();
    const adminToken = tokenData.access_token;

    // First, get the current user data to preserve existing attributes
    const getUserResponse = await fetch(
      `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/users/${userId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!getUserResponse.ok) {
      const errorText = await getUserResponse.text();
      console.error('Failed to get current user data:', errorText);
      return NextResponse.json(
        { error: 'Failed to retrieve current user data from Keycloak' }, 
        { status: getUserResponse.status }
      );
    }

    const userData = await getUserResponse.json();
    
    // Merge existing attributes with new Nostr attributes
    const updatedAttributes = {
      ...(userData.attributes || {}),
      nsec_encrypted: [encryptedNsec],
      npub: [npub],
      nostr_sync_date: [new Date().toISOString()],
    };

    // Update user attributes in Keycloak while preserving other fields
    const updateUserResponse = await fetch(
      `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/users/${userId}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userData,
          attributes: updatedAttributes,
        }),
      }
    );

    if (!updateUserResponse.ok) {
      const errorText = await updateUserResponse.text();
      console.error('Failed to update user attributes:', errorText);
      return NextResponse.json(
        { error: 'Failed to save Nostr keys to Keycloak' }, 
        { status: updateUserResponse.status }
      );
    }

    // Return success response
    return NextResponse.json({ success: true, message: 'NSEC successfully synced with Keycloak' });
  } catch (error) {
    console.error('Error during Keycloak sync:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during synchronization' }, 
      { status: 500 }
    );
  }
}
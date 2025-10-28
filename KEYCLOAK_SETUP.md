# Keycloak Setup Guide for Nostr NSEC Storage

This guide provides step-by-step instructions on setting up Keycloak for storing and managing Nostr private keys (nsec) securely. The setup involves creating a realm, client, and custom user attributes.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Important Note About Keycloak URL Structure](#important-note-about-keycloak-url-structure)
3. [Setting Up Keycloak](#setting-up-keycloak)
4. [Creating a Realm](#creating-a-realm)
5. [Setting Up Clients](#setting-up-clients)
6. [Creating Custom User Attributes](#creating-custom-user-attributes)
7. [Creating Mappers](#creating-mappers)
8. [Setting Up Service Account](#setting-up-service-account)
9. [Configuring the Application](#configuring-the-application)
10. [Security Considerations](#security-considerations)
11. [Troubleshooting](#troubleshooting)

## Prerequisites

- A running Keycloak instance (version 18.0.0 or higher recommended)
- Administrative access to Keycloak
- Basic knowledge of OAuth 2.0 and OpenID Connect

## Important Note About Keycloak URL Structure

Starting with Keycloak 17 (Quarkus distribution), the default context path has changed. Previously, Keycloak URLs included an `/auth` segment (e.g., `https://keycloak.example.com/auth`), but newer versions have removed this segment.

When configuring your environment variables, use the appropriate URL format based on your Keycloak version:

- **For newer Keycloak versions (17+)**:
  ```
  NEXT_PUBLIC_KEYCLOAK_INSTANCE_URL=https://keycloak.example.com
  KEYCLOAK_URL=https://keycloak.example.com
  ```

- **For older Keycloak versions**:
  ```
  NEXT_PUBLIC_KEYCLOAK_INSTANCE_URL=https://keycloak.example.com/auth
  KEYCLOAK_URL=https://keycloak.example.com/auth
  ```

You can check your Keycloak version by visiting your Keycloak Admin Console. The version number is typically displayed at the bottom of the login page or in the server information section.

## Setting Up Keycloak

If you don't have a Keycloak instance running, you can set one up using Docker:

```bash
docker run -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:latest start-dev
```

Access the Keycloak admin console at `http://localhost:8080/admin/` and log in with the credentials you configured.

## Creating a Realm

1. Log in to the Keycloak admin console
2. Hover over the realm dropdown in the top-left corner and click "Create Realm"
3. Enter "nostr-onboarding" as the name
4. Click "Create"

## Setting Up Clients

You need to set up two clients:
1. A public client for the frontend application
2. A confidential client for backend API calls

### Frontend Client

1. In the "nostr-onboarding" realm, go to "Clients" in the left sidebar
2. Click "Create client"
3. Fill in the following:
   - Client ID: `nostr-onboarding-client`
   - Name: `Nostr Onboarding Client`
   - Client Authentication: Off (public client)
4. Click "Next"
5. Set Valid redirect URIs to include your application URLs (e.g., `http://localhost:3000/*`)
6. Set Web Origins to `+` (to allow CORS from any origin that's in Valid redirect URIs)
7. Click "Save"

### Backend Client

1. Go back to "Clients" and click "Create client" again
2. Fill in the following:
   - Client ID: `nostr-onboarding-service`
   - Name: `Nostr Onboarding Service`
   - Client Authentication: On (confidential client)
3. Click "Next"
4. Click "Next" again (skip the Capability config)
5. Note the "Client secret" on the credentials tab - you'll need this for your application's `.env` file

## Creating Custom User Attributes

Keycloak stores user attributes in a flexible way, but we need to configure it to support storing the Nostr keys:

1. Go to "Realm settings" in the left sidebar
2. Select the "User Profile" tab
3. Click on "JSON Editor" to edit the user profile configuration
4. Add the following JSON to define the custom attributes:

```json
{
  "attributes": [
    {
      "name": "nsec_encrypted",
      "displayName": "${nsec_encrypted}",
      "validations": {
        "length": {
          "max": 2048
        }
      },
      "permissions": {
        "view": ["admin", "user"],
        "edit": ["admin", "user"]
      }
    },
    {
      "name": "npub",
      "displayName": "${npub}",
      "validations": {
        "length": {
          "max": 512
        }
      },
      "permissions": {
        "view": ["admin", "user"],
        "edit": ["admin", "user"]
      }
    },
    {
      "name": "nostr_sync_date",
      "displayName": "${nostr_sync_date}",
      "validations": {
        "length": {
          "max": 64
        }
      },
      "permissions": {
        "view": ["admin", "user"],
        "edit": ["admin", "user"]
      }
    }
  ]
}
```

5. Click "Save"

## Creating Mappers

To make the custom attributes available in the tokens:

1. Go to "Clients" and select the `nostr-onboarding-client` client
2. Go to the "Client scopes" tab
3. Click on the "nostr-onboarding-client-dedicated" scope
4. Go to the "Mappers" tab
5. Click "Add mapper" → "By configuration"
6. Select "User Attribute"
7. Fill in the following:
   - Name: `npub mapper`
   - User Attribute: `npub`
   - Token Claim Name: `npub`
   - Claim JSON Type: String
   - Add to ID token: On
   - Add to access token: On
   - Add to userinfo: On
   - Multivalued: Off
   - Aggregate attribute values: Off
8. Click "Save"

Repeat the process for the `nostr_sync_date` attribute, but do NOT create a mapper for the `nsec_encrypted` attribute as it should never be included in tokens.

## Setting Up Service Account

For the backend service to be able to update user attributes:

1. Go to "Clients" and select the `nostr-onboarding-service` client
2. Go to the "Service account roles" tab
3. Click "Assign role" and search for "manage-users"
4. Select the "manage-users" role from the "realm-management" client
5. Click "Assign"

## Configuring the Application

Update your application's `.env` file with the following values, being careful to use the correct URL format for your Keycloak version (see [Important Note About Keycloak URL Structure](#important-note-about-keycloak-url-structure)):

```bash
# Enable/disable Keycloak synchronization
NEXT_PUBLIC_ENABLE_KEYCLOAK_SYNC=true

# Public Keycloak configuration (available in browser)
# For Keycloak 17+ (Quarkus distribution):
NEXT_PUBLIC_KEYCLOAK_INSTANCE_URL=https://your-keycloak-instance
# For older Keycloak versions:
# NEXT_PUBLIC_KEYCLOAK_INSTANCE_URL=https://your-keycloak-instance/auth

NEXT_PUBLIC_KEYCLOAK_REALM=nostr-onboarding
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=nostr-onboarding-client

# Server-side Keycloak configuration (not exposed to browser)
# For Keycloak 17+ (Quarkus distribution):
KEYCLOAK_URL=https://your-keycloak-instance
# For older Keycloak versions:
# KEYCLOAK_URL=https://your-keycloak-instance/auth

KEYCLOAK_REALM=nostr-onboarding
KEYCLOAK_CLIENT_ID=nostr-onboarding-service
KEYCLOAK_CLIENT_SECRET=your-client-secret-from-keycloak

# Security configuration
# Generate a 64-character hex key for AES-256 encryption (32 bytes)
# Generate with: openssl rand -hex 32
ENCRYPTION_KEY=your-generated-encryption-key
```

## Security Considerations

1. **Encryption**: The NSEC keys are encrypted using AES-256-GCM before being stored in Keycloak. This ensures that even if Keycloak's database is compromised, the private keys remain protected.

2. **Transport Security**: Always use HTTPS for all communications with Keycloak.

3. **Access Control**: Use the minimum required permissions for the service account.

4. **Token Lifetimes**: Configure short-lived access tokens in Keycloak (10-15 minutes recommended).

5. **Client Secret**: Keep the client secret secure and rotate it periodically.

6. **Audit Logging**: Enable audit logging in Keycloak to track access to sensitive user attributes.

## Troubleshooting

### Common Issues

1. **"Page not found" error when redirecting to Keycloak**: 
   This is usually caused by using the wrong URL format for your Keycloak version. Check if your Keycloak URL should include `/auth` or not based on your Keycloak version as described in the [Important Note About Keycloak URL Structure](#important-note-about-keycloak-url-structure) section.

2. **CORS Errors**: Ensure that the Web Origins in the client settings include your application's domain.

3. **Authentication Failures**: Check that the client IDs and secrets are correct, and that the redirect URIs match exactly.

4. **Permission Denied**: Verify that the service account has the required roles (manage-users).

5. **Token Issues**: If user attributes aren't available in tokens, check that the mappers are configured correctly.

### Testing Keycloak Connectivity

To test if your Keycloak configuration is correct:

1. Try to access your Keycloak server's OpenID configuration endpoint:
   ```bash
   # For newer Keycloak versions (17+):
   curl https://keycloak.example.com/realms/your-realm/.well-known/openid-configuration

   # For older Keycloak versions:
   curl https://keycloak.example.com/auth/realms/your-realm/.well-known/openid-configuration
   ```

2. If you receive a valid JSON response, your URL is correct.

### Keycloak Logs

For more detailed troubleshooting, check the Keycloak server logs:

```bash
docker logs keycloak-container-name
```

or if running standalone:

```bash
tail -f /path/to/keycloak/standalone/log/server.log
```

---

For additional help or questions, please open an issue in the GitHub repository.
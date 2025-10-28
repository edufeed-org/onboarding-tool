# Testing the Keycloak NSEC Sync Implementation

This document outlines how to test the complete implementation of the NSEC sync feature with Keycloak.

## Prerequisites

1. A running Keycloak instance configured according to the [KEYCLOAK_SETUP.md](./KEYCLOAK_SETUP.md) guide
2. The application properly configured with all necessary environment variables
3. A web browser with developer tools enabled

## Test Flow

### 1. Environment Setup Verification

First, ensure that your application has the correct environment variables set:

```bash
# Check .env file
cat .env
```

Verify that the following variables are properly configured:
- `NEXT_PUBLIC_ENABLE_KEYCLOAK_SYNC=true`
- `NEXT_PUBLIC_KEYCLOAK_INSTANCE_URL` points to your Keycloak instance
- `NEXT_PUBLIC_KEYCLOAK_REALM` is set to the correct realm
- `NEXT_PUBLIC_KEYCLOAK_CLIENT_ID` is set to your public client ID
- `KEYCLOAK_URL` points to your Keycloak instance (server-side)
- `KEYCLOAK_REALM` matches your realm
- `KEYCLOAK_CLIENT_ID` is set to your service client ID
- `KEYCLOAK_CLIENT_SECRET` contains your client secret
- `ENCRYPTION_KEY` is a valid 64-character hex string

### 2. Start the Application

```bash
npm run dev
```

### 3. Test End-to-End Flow

1. **Open Application**: Navigate to http://localhost:3000 in your browser
2. **Go through Onboarding**:
   - Generate a new Nostr key pair
   - Download or save the keys
   - Continue to the Keycloak synchronization page

3. **On the Keycloak Page**:
   - Verify that the page displays correctly with your Keycloak instance URL
   - Click the "Synchronize" button
   - You should be redirected to the Keycloak login page
   - Log in with a valid user account

4. **Verification**:
   - After successful authentication, you should be redirected back to the application
   - The application should show a success message and redirect to the completion page
   - Check the browser console for any errors

### 4. Verify Backend Process

While testing, monitor the server logs for any errors or issues:

```bash
# In another terminal
tail -f .next/logs/server.log
```

### 5. Verify Data in Keycloak

1. Log in to the Keycloak Admin Console
2. Navigate to your realm
3. Go to "Users" and find the user you used for testing
4. Click on the user and go to "Attributes"
5. Verify that the following attributes are present:
   - `nsec_encrypted` (should be an encrypted value)
   - `npub` (should match the public key from the test)
   - `nostr_sync_date` (should have a timestamp)

### 6. Test Recovery Flow (Optional)

To test that the encryption and storage works correctly, try retrieving the key:

1. Create a new API endpoint `/api/keycloak-retrieve` that:
   - Authenticates with Keycloak
   - Retrieves the encrypted NSEC
   - Decrypts it
   - Returns it securely to the client

2. Create a test page to access this endpoint and verify the key matches the original

## Troubleshooting

### Common Issues

1. **CORS Errors**: Check that your Keycloak client has the correct Web Origins configured
2. **Authentication Failures**: Verify client IDs and secrets
3. **Missing Attributes**: Ensure the user profile in Keycloak is configured to accept custom attributes
4. **Encryption Errors**: Check that your encryption key is exactly 64 characters (32 bytes)

### Debugging Tips

- Use browser developer tools to monitor network requests
- Check for any error responses from the API endpoints
- Verify that tokens are being properly received and sent
- Look for any encryption/decryption errors in the server logs
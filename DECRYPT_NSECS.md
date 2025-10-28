# Decrypting NSEC Keys

This document explains how to decrypt Nostr Secret Keys (nsecs) that have been encrypted by the nostr-onboarding-keycloak system.

## About the Encryption

Nostr Secret Keys (nsecs) are encrypted using AES-256-GCM encryption before being stored in Keycloak. The encryption process:

1. Generates a random 16-byte initialization vector (IV)
2. Uses AES-256-GCM to encrypt the nsec with the encryption key
3. Concatenates the IV, encrypted data, and authentication tag
4. Encodes the result as a base64 string

This ensures that even if Keycloak's database is compromised, the private keys remain protected.

## Decryption Script

The `decrypt_nsecs.py` script is provided to decrypt these keys. It requires Python 3.6+ and the `cryptography` package.

### Prerequisites

1. Python 3.6 or higher
2. The `cryptography` package

Install the required package:

```bash
pip install cryptography
```

### Usage

The script can be used in several ways:

#### 1. Decrypt a single encrypted NSEC with a key provided directly

```bash
python decrypt_nsecs.py --encrypted "BASE64_ENCRYPTED_NSEC" --key "YOUR_64_CHAR_HEX_KEY"
```

#### 2. Decrypt a single encrypted NSEC using the key from the .env file

```bash
python decrypt_nsecs.py --encrypted "BASE64_ENCRYPTED_NSEC" --dotenv
```

#### 3. Decrypt a single encrypted NSEC using the key from an environment variable

```bash
python decrypt_nsecs.py --encrypted "BASE64_ENCRYPTED_NSEC" --env
```

#### 4. Decrypt multiple encrypted NSECs from a file

```bash
python decrypt_nsecs.py --file "/path/to/encrypted_nsecs.txt" --dotenv
```

### Options

- `--encrypted`, `-e`: Encrypted NSEC string to decrypt
- `--file`, `-f`: File containing encrypted NSEC keys, one per line
- `--key`, `-k`: Encryption key (64-character hex string)
- `--env`: Read encryption key from the `ENCRYPTION_KEY` environment variable
- `--dotenv`: Read encryption key from the `.env` file in the current directory
- `--debug`: Show additional debugging information during decryption
- `--check-format`: Only validate the format of the encrypted data without decrypting

### Debugging Commands

For troubleshooting encrypted NSECs:

```bash
# Check the format of an encrypted string without decrypting
python decrypt_nsecs.py --encrypted "YOUR_ENCRYPTED_NSEC" --check-format

# Show detailed debug info during decryption
python decrypt_nsecs.py --encrypted "YOUR_ENCRYPTED_NSEC" --dotenv --debug
```

## Security Considerations

- Keep your encryption key secure
- When using the script, ensure you're in a secure environment
- Consider running the script on an air-gapped computer for maximum security
- Delete any decrypted NSECs from your file system after use
- Remember that NSECs provide full control over your Nostr identity - protect them carefully

## Extracting Encrypted NSECs from Keycloak

If you need to extract the encrypted NSECs from Keycloak, you can:

1. Use the Keycloak Admin API to fetch user attributes
2. Export the Keycloak database and query the user attribute tables
3. Use the Keycloak Admin Console to view individual user attributes

Example of fetching user attributes with the Keycloak Admin API:

```bash
# First, get an access token
KC_TOKEN=$(curl -s -X POST \
  "$KEYCLOAK_URL/realms/master/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=$ADMIN_USERNAME" \
  -d "password=$ADMIN_PASSWORD" \
  -d "grant_type=password" \
  -d "client_id=admin-cli" | jq -r '.access_token')

# Then fetch the user with their attributes
curl -s -X GET \
  "$KEYCLOAK_URL/admin/realms/$REALM/users?username=$USERNAME&exact=true" \
  -H "Authorization: Bearer $KC_TOKEN" | jq '.[0].attributes.nsec_encrypted[0]'
```

## Troubleshooting

If you encounter the "Decryption error" message, try these steps:

1. Verify that your encryption key is correct (it should be a 64-character hex string)
2. Run with the `--check-format` flag to validate the encrypted data:
   ```bash
   python decrypt_nsecs.py --encrypted "YOUR_ENCRYPTED_NSEC" --check-format
   ```
3. Try running with the `--debug` flag for more information:
   ```bash
   python decrypt_nsecs.py --encrypted "YOUR_ENCRYPTED_NSEC" --dotenv --debug
   ```
4. Check if the format matches what's expected:
   - The script expects: `[IV (16 bytes)][encrypted data][auth tag (16 bytes)]` encoded as base64
   - This matches the implementation in `app/api/keycloak-sync/route.ts`

The most common issues are:
1. Incorrect encryption key
2. Data format doesn't match what the script expects
3. Corrupted encrypted data
4. Different encryption method was used than what the script implements

For more help, refer to the detailed error messages provided by the script.

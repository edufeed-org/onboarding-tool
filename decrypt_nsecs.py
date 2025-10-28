#!/usr/bin/env python3
"""
Nostr NSEC Decryption Tool

This script decrypts NSEC keys that have been encrypted using AES-256-GCM 
as implemented in the nostr-onboarding-keycloak project.
"""

import sys
import os
import base64
import argparse
import binascii
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

def decrypt_nsec(encrypted_data: str, encryption_key: str) -> str:
    """
    Decrypt an encrypted NSEC key
    
    Args:
        encrypted_data: Base64-encoded encrypted data
        encryption_key: 64-character hex key (32 bytes for AES-256)
        
    Returns:
        Decrypted NSEC string
    """
    # Validate the encryption key
    if not encryption_key or len(encryption_key) != 64:
        print(f"Error: Encryption key must be 64 characters, got {len(encryption_key)}")
        sys.exit(1)
    
    try:
        int(encryption_key, 16)  # Check if it's valid hex
    except ValueError:
        print("Error: Encryption key must be a valid hexadecimal string")
        sys.exit(1)
    
    # Decode the base64 data
    try:
        print(f"Attempting to decode base64 string: {encrypted_data[:10]}... (length: {len(encrypted_data)})")
        decoded_data = base64.b64decode(encrypted_data)
        hex_data = decoded_data.hex()
        print(f"Decoded data length: {len(decoded_data)} bytes")
    except Exception as e:
        print(f"Error decoding base64 data: {e}")
        print("Make sure the encrypted string is a valid base64 string")
        sys.exit(1)
    
    # Check if the decoded data is long enough
    if len(decoded_data) < 32:  # At minimum we need IV (16 bytes)
        print(f"Error: Decoded data too short ({len(decoded_data)} bytes). Expected at least 32 bytes.")
        sys.exit(1)
    
    # Extract the components from the hex string
    # In the original implementation:
    # return Buffer.from(iv.toString('hex') + encrypted + authTag.toString('hex')).toString('base64');
    # - IV is 16 bytes (32 hex chars) at the beginning
    # - Auth tag is 16 bytes (32 hex chars) at the end
    # - The middle is the encrypted data
    iv_hex = hex_data[:32]
    auth_tag_hex = hex_data[-32:]
    encrypted_hex = hex_data[32:-32]
    
    print(f"Parsing decoded data:")
    print(f"Total hex length: {len(hex_data)} characters")
    print(f"IV: {iv_hex[:8]}... (32 chars)")
    print(f"Auth tag: {auth_tag_hex[:8]}... (32 chars)")
    print(f"Encrypted data: {encrypted_hex[:8]}... ({len(encrypted_hex)} chars)")
    
    # Convert hex strings to bytes
    try:
        iv = bytes.fromhex(iv_hex)
        auth_tag = bytes.fromhex(auth_tag_hex)
        encrypted_data_bytes = bytes.fromhex(encrypted_hex)
        key = bytes.fromhex(encryption_key)
    except Exception as e:
        print(f"Error processing hex data: {e}")
        sys.exit(1)
    
    # Decrypt using AES-GCM
    try:
        # Create a new AESGCM instance with the key
        aesgcm = AESGCM(key)
        
        # Debug info
        print(f"Debug info:")
        print(f"IV length: {len(iv)} bytes")
        print(f"Encrypted data length: {len(encrypted_data_bytes)} bytes")
        print(f"Auth tag length: {len(auth_tag)} bytes")
        print(f"Key length: {len(key)} bytes")
        
        # In the Node.js crypto implementation, the auth tag is handled separately
        # In the Python cryptography library, we need to append the auth tag to the ciphertext
        ciphertext_with_tag = encrypted_data_bytes + auth_tag
        
        try:
            # Try decryption with the combined ciphertext and auth tag
            decrypted = aesgcm.decrypt(iv, ciphertext_with_tag, None)
            return decrypted.decode('utf-8')
        except Exception as inner_e:
            print(f"Standard decryption failed: {inner_e}")
            
            # Try the direct method - some libraries expect the auth tag as a separate parameter
            print("Trying alternative decryption method...")
            
            # For Node.js crypto with AES-GCM, we need a different approach
            # In the Node.js implementation, the auth tag is stored at the end 
            # See: cipher.getAuthTag() method in Node.js
            from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
            from cryptography.hazmat.backends import default_backend
            
            # Try with a Cipher object directly
            cipher = Cipher(
                algorithms.AES(key),
                modes.GCM(iv, tag=auth_tag),
                backend=default_backend()
            )
            
            decryptor = cipher.decryptor()
            
            try:
                # Decrypt without the auth tag (it's already in the GCM mode)
                decrypted = decryptor.update(encrypted_data_bytes) + decryptor.finalize()
                return decrypted.decode('utf-8')
            except Exception as direct_e:
                print(f"Direct GCM decryption failed: {direct_e}")
                
                # Last resort - try an alternative layout
                print("Trying alternative data layout...")
                
                # Maybe the format is different
                if len(hex_data) >= 64:  # Make sure we have enough data
                    # Try different possible layouts
                    possible_layouts = [
                        # Normal layout (IV at start, tag at end)
                        {"iv": hex_data[:32], "data": hex_data[32:-32], "tag": hex_data[-32:]},
                        # Tag then IV then data
                        {"iv": hex_data[32:64], "data": hex_data[64:], "tag": hex_data[:32]},
                        # Data then IV then tag
                        {"iv": hex_data[-64:-32], "data": hex_data[:-64], "tag": hex_data[-32:]},
                    ]
                    
                    for i, layout in enumerate(possible_layouts):
                        try:
                            print(f"Trying layout {i+1}...")
                            alt_iv = bytes.fromhex(layout["iv"])
                            alt_data = bytes.fromhex(layout["data"])
                            alt_tag = bytes.fromhex(layout["tag"])
                            
                            cipher = Cipher(
                                algorithms.AES(key),
                                modes.GCM(alt_iv, tag=alt_tag),
                                backend=default_backend()
                            )
                            
                            decryptor = cipher.decryptor()
                            decrypted = decryptor.update(alt_data) + decryptor.finalize()
                            return decrypted.decode('utf-8')
                        except Exception as layout_e:
                            print(f"Layout {i+1} failed: {layout_e}")
                
                raise Exception("All decryption methods failed")
                
    except Exception as e:
        print(f"Decryption error: {e}")
        print("This could be due to an incorrect encryption key or corrupted data.")
        print("\nPossible issues:")
        print("1. The encryption key is incorrect (must be 64 hex characters / 32 bytes)")
        print("2. The encrypted data is not in the expected format")
        print("3. The encrypted data might be using a different encryption method")
        print("4. The format of the encrypted data might not match our assumptions")
        
        print("\nTry checking if there is a decryption function in your codebase for reference")
        print("or check the exact encryption implementation in app/api/keycloak-sync/route.ts")
        sys.exit(1)

def main():
    parser = argparse.ArgumentParser(description='Decrypt Nostr NSEC keys')
    parser.add_argument('--file', '-f', help='File containing encrypted NSEC keys, one per line')
    parser.add_argument('--encrypted', '-e', help='Encrypted NSEC string to decrypt')
    parser.add_argument('--key', '-k', help='Encryption key (64-character hex string)')
    parser.add_argument('--env', action='store_true', help='Read encryption key from ENCRYPTION_KEY environment variable')
    parser.add_argument('--dotenv', action='store_true', help='Read encryption key from .env file')
    parser.add_argument('--debug', action='store_true', help='Show extra debugging information')
    parser.add_argument('--check-format', action='store_true', help='Only check the format of the encrypted data without decrypting')
    
    args = parser.parse_args()
    
    # Get the encryption key
    encryption_key = None
    
    if args.key:
        encryption_key = args.key
    elif args.env:
        encryption_key = os.environ.get('ENCRYPTION_KEY')
        if not encryption_key:
            print("Error: ENCRYPTION_KEY environment variable not set")
            sys.exit(1)
    elif args.dotenv:
        try:
            # Simple .env file reader
            with open('.env', 'r') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#') and '=' in line:
                        key, value = line.split('=', 1)
                        if key == 'ENCRYPTION_KEY':
                            encryption_key = value
                            break
            if not encryption_key:
                print("Error: ENCRYPTION_KEY not found in .env file")
                sys.exit(1)
            else:
                if args.debug:
                    print(f"Found encryption key in .env: {encryption_key[:4]}...{encryption_key[-4:]} (length: {len(encryption_key)})")
        except Exception as e:
            print(f"Error reading .env file: {e}")
            sys.exit(1)
    else:
        if not args.check_format:
            print("Error: Please provide an encryption key using --key, --env, or --dotenv")
            sys.exit(1)
    
    # Validate the encryption key if provided
    if encryption_key and not args.check_format:
        if len(encryption_key) != 64:
            print(f"Error: Encryption key must be a 64-character hex string, got {len(encryption_key)} characters")
            sys.exit(1)
        try:
            int(encryption_key, 16)  # Check if it's valid hex
        except ValueError:
            print("Error: Encryption key is not a valid hexadecimal string")
            sys.exit(1)
    
    # Process the encrypted data
    if args.file:
        try:
            with open(args.file, 'r') as f:
                for line_num, line in enumerate(f, 1):
                    encrypted = line.strip()
                    if encrypted:
                        try:
                            if args.check_format:
                                check_encrypted_format(encrypted)
                            else:
                                if args.debug:
                                    print(f"\nProcessing line {line_num}: {encrypted[:10]}...")
                                decrypted = decrypt_nsec(encrypted, encryption_key)
                                print(f"Line {line_num}: {decrypted}")
                        except Exception as e:
                            print(f"Error processing line {line_num}: {e}")
        except Exception as e:
            print(f"Error reading file: {e}")
            sys.exit(1)
    elif args.encrypted:
        if args.check_format:
            check_encrypted_format(args.encrypted)
        else:
            decrypted = decrypt_nsec(args.encrypted, encryption_key)
            print(decrypted)
    else:
        print("Error: Please provide either a file or an encrypted string to decrypt")
        sys.exit(1)

def check_encrypted_format(encrypted_data: str):
    """Check the format of encrypted data without decrypting it"""
    print(f"Checking format of: {encrypted_data[:10]}... (length: {len(encrypted_data)})")
    
    try:
        # Check if it's valid base64
        decoded = base64.b64decode(encrypted_data)
        print(f"✓ Valid base64 encoding")
        print(f"✓ Decoded length: {len(decoded)} bytes")
        
        # Check if it follows expected structure
        hex_data = decoded.hex()
        print(f"✓ Hex representation: {hex_data[:10]}...{hex_data[-10:]} (length: {len(hex_data)} chars)")
        
        if len(hex_data) < 64:
            print(f"✗ Data too short! Expected at least 64 hex chars (32 bytes), got {len(hex_data)}")
            return
            
        # Extract components
        iv_hex = hex_data[:32]
        auth_tag_hex = hex_data[-32:]
        encrypted_hex = hex_data[32:-32]
        
        print(f"✓ IV: {iv_hex} (32 chars = 16 bytes)")
        print(f"✓ Auth tag: {auth_tag_hex} (32 chars = 16 bytes)")
        print(f"✓ Encrypted data: {encrypted_hex[:10]}... ({len(encrypted_hex)} chars)")
        
        # Check if they're valid hex
        bytes.fromhex(iv_hex)
        bytes.fromhex(auth_tag_hex)
        bytes.fromhex(encrypted_hex)
        print(f"✓ All components are valid hex")
        
        print(f"\nThe encrypted data appears to be correctly formatted.")
        print(f"Format: [16-byte IV][encrypted data][16-byte auth tag] encoded as base64")
        
    except Exception as e:
        print(f"✗ Format check failed: {e}")
        print(f"The encrypted data does not match the expected format.")
        
    print("\nOriginal encryption code from route.ts:")
    print("  // Return IV + encrypted data + auth tag as base64 string")
    print("  return Buffer.from(iv.toString('hex') + encrypted + authTag.toString('hex')).toString('base64');")
    
    print("\nIf your data was encrypted differently, you may need to modify the script.")

if __name__ == "__main__":
    main()
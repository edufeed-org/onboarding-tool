# Nostr NIP-02 Contacts Hook

This hook provides comprehensive functionality for managing Nostr contacts according to NIP-02 specification, with additional support for following starter packs from NIP-51.

## Features

- **Read Contact Lists**: Fetch and parse NIP-02 contact list events (kind 3)
- **Follow/Unfollow**: Add or remove individual contacts
- **Starter Pack Support**: Follow all contacts from a NIP-51 starter pack at once
- **Profile Metadata**: Automatically fetch contact profile information (kind 0)
- **Auto-sync**: Optional automatic synchronization with relays
- **Follow Status**: Check if you're already following specific pubkeys

## Installation

The hook uses `nostr-tools` which should already be installed in your project:

```bash
npm install nostr-tools
```

## Basic Usage

```tsx
import { useNip02Contacts } from '@/hooks/useNip02Contacts';

function MyComponent() {
  const {
    contacts,
    contactProfiles,
    loading,
    error,
    followPubkey,
    unfollowPubkey,
    followStarterPack,
    isFollowing,
    refresh
  } = useNip02Contacts({
    userPubkey: 'your-public-key-hex',
    userPrivateKey: 'your-private-key-hex-or-nsec',
    relays: ['wss://relay.damus.io', 'wss://relay.primal.net'],
    enableAutoSync: true
  });

  // Your component logic here
}
```

## API Reference

### Options

```typescript
interface UseNip02ContactsOptions {
  userPubkey?: string; // Your public key (hex format)
  userPrivateKey?: string | Uint8Array; // Your private key (hex, nsec, or Uint8Array)
  relays?: string[]; // Relay URLs to use
  enableAutoSync?: boolean; // Auto-refresh every 30 seconds
}
```

### Return Values

```typescript
interface UseNip02ContactsReturn {
  contacts: Contact[]; // Array of your contacts
  contactProfiles: Record<string, ContactProfile>; // Profile metadata for contacts
  loading: boolean; // Loading state
  error: string | null; // Error message if any
  followPubkey: (pubkey: string, relay?: string, petname?: string) => Promise<void>;
  unfollowPubkey: (pubkey: string) => Promise<void>;
  followStarterPack: (pubkeys: string[], baseRelay?: string) => Promise<void>;
  isFollowing: (pubkey: string) => boolean;
  refresh: () => void;
}
```

### Types

```typescript
interface Contact {
  pubkey: string; // The contact's public key
  relay?: string; // Preferred relay for this contact
  petname?: string; // Local nickname for this contact
}

interface ContactProfile {
  pubkey: string;
  name?: string; // Display name
  picture?: string; // Profile picture URL
  about?: string; // Bio/description
  nip05?: string; // NIP-05 identifier
}
```

## Examples

### Following a Single User

```tsx
const handleFollowUser = async () => {
  try {
    await followPubkey(
      'npub1abc123...', // pubkey
      'wss://relay.example.com', // optional relay
      'Alice' // optional petname
    );
    console.log('Successfully followed user!');
  } catch (error) {
    console.error('Failed to follow user:', error);
  }
};
```

### Following a Starter Pack

```tsx
import { useStarterPacks } from '@/hooks/useStarterPacks';

const { starterPacks } = useStarterPacks();
const selectedPack = starterPacks[0];

const handleFollowPack = async () => {
  try {
    await followStarterPack(selectedPack.profiles);
    console.log('Successfully followed starter pack!');
  } catch (error) {
    console.error('Failed to follow starter pack:', error);
  }
};
```

### Checking Follow Status

```tsx
const MyContactList = ({ contacts }) => {
  return (
    <div>
      {contacts.map(contact => (
        <div key={contact.pubkey}>
          <span>{contactProfiles[contact.pubkey]?.name || 'Anonymous'}</span>
          {isFollowing(contact.pubkey) && <span>✓ Following</span>}
        </div>
      ))}
    </div>
  );
};
```

### Using with StarterPackCard

```tsx
import { StarterPackCard } from '@/components/starter-pack-card';
import { useStarterPacks } from '@/hooks/useStarterPacks';

function StarterPacksList() {
  const { starterPacks } = useStarterPacks();
  
  return (
    <div className="grid gap-4">
      {starterPacks.map(pack => (
        <StarterPackCard
          key={pack.id}
          starterPack={pack}
          userPubkey="your-pubkey-here"
          userPrivateKey="your-private-key-here"
          relays={['wss://relay.damus.io']}
        />
      ))}
    </div>
  );
}
```

## Private Key Formats

The hook accepts private keys in multiple formats:

- **Hex string**: `"abc123def456..."`
- **nsec format**: `"nsec1abc123def456..."`
- **Uint8Array**: `new Uint8Array([...])`

The hook automatically detects the format and converts as needed.

## Security Considerations

1. **Never hardcode private keys** in your source code
2. **Store private keys securely** (localStorage with encryption, hardware wallets, etc.)
3. **Use environment variables** for development/testing
4. **Consider using NIP-07** browser extensions for key management in production

## Error Handling

The hook provides error information through the `error` state:

```tsx
const { error } = useNip02Contacts(options);

if (error) {
  console.error('Contacts error:', error);
  // Handle error appropriately
}
```

Common errors:
- Invalid private key format
- Network/relay connection issues
- Missing required parameters
- Already following a contact

## Demo Component

See `/components/nostr-contacts-demo.tsx` for a complete working example that demonstrates all features of the hook.

## NIP References

- [NIP-02: Contact Lists](https://github.com/nostr-protocol/nips/blob/master/02.md)
- [NIP-51: Lists](https://github.com/nostr-protocol/nips/blob/master/51.md)
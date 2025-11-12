"use client";

import { useEffect, useState, useCallback, useMemo } from 'react';
import { SimplePool, Filter, Event, finalizeEvent, nip19 } from 'nostr-tools';

// Contact interface representing a single follow
export interface Contact {
  pubkey: string;
  relay?: string;
  petname?: string;
}

// Profile metadata for contacts
export interface ContactProfile {
  pubkey: string;
  name?: string;
  picture?: string;
  about?: string;
  nip05?: string;
}

export interface UseNip02ContactsOptions {
  userPubkey?: string; // The user's public key to fetch their contacts
  userPrivateKey?: string | Uint8Array; // The user's private key for signing new events (hex string, nsec, or Uint8Array)
  relays?: string[];
  enableAutoSync?: boolean; // Auto-sync with relays periodically
}

export interface UseNip02ContactsReturn {
  contacts: Contact[];
  contactProfiles: Record<string, ContactProfile>;
  loading: boolean;
  error: string | null;
  followPubkey: (pubkey: string, relay?: string, petname?: string) => Promise<void>;
  unfollowPubkey: (pubkey: string) => Promise<void>;
  followStarterPack: (pubkeys: string[], baseRelay?: string) => Promise<void>;
  isFollowing: (pubkey: string) => boolean;
  refresh: () => void;
}

// Default relays to use for fetching contacts
const DEFAULT_RELAYS = [
  'wss://relay.damus.io',
  'wss://relay.primal.net',
  'wss://relay.nostr.band',
  'wss://nos.lol'
];

export function useNip02Contacts(options: UseNip02ContactsOptions = {}): UseNip02ContactsReturn {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactProfiles, setContactProfiles] = useState<Record<string, ContactProfile>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    userPubkey,
    userPrivateKey,
    relays = DEFAULT_RELAYS,
    enableAutoSync = false
  } = options;

  // Memoize the relays array to prevent dependency changes
  const memoizedRelays = useMemo(() => relays, [JSON.stringify(relays)]);

  // Parse NIP-02 contact list event
  const parseContactList = useCallback((event: Event): Contact[] => {
    const contacts: Contact[] = [];

    for (const tag of event.tags) {
      if (tag[0] === 'p' && tag[1]) {
        contacts.push({
          pubkey: tag[1],
          relay: tag[2] || undefined,
          petname: tag[3] || undefined
        });
      }
    }

    return contacts;
  }, []);

  // Fetch contact profiles metadata
  const fetchContactProfiles = useCallback(async (pool: SimplePool, pubkeys: string[]) => {
    if (pubkeys.length === 0) return {};

    const filter: Filter = {
      kinds: [0], // Profile metadata
      authors: pubkeys
    };

    const profiles: Record<string, ContactProfile> = {};
    
    try {
      const events = await pool.querySync(memoizedRelays, filter);
      
      for (const event of events) {
        try {
          const profile = JSON.parse(event.content);
          profiles[event.pubkey] = {
            pubkey: event.pubkey,
            name: profile.name || profile.display_name,
            picture: profile.picture,
            about: profile.about,
            nip05: profile.nip05
          };
        } catch (err) {
          console.error('Failed to parse profile metadata:', err);
        }
      }
    } catch (err) {
      console.error('Failed to fetch contact profiles:', err);
    }

    return profiles;
  }, [memoizedRelays]);

  // Fetch contacts from relays
  const fetchContacts = useCallback(async () => {
    if (!userPubkey) return;

    setLoading(true);
    setError(null);

    const pool = new SimplePool();

    try {
      // Fetch the most recent contact list (kind 3) for the user
      const filter: Filter = {
        kinds: [3], // Contact list
        authors: [userPubkey],
        limit: 1
      };

      const events = await pool.querySync(memoizedRelays, filter);
      
      if (events.length === 0) {
        setContacts([]);
        setContactProfiles({});
        return;
      }

      // Get the most recent contact list event
      const latestEvent = events.sort((a, b) => b.created_at - a.created_at)[0];
      const parsedContacts = parseContactList(latestEvent);
      
      setContacts(parsedContacts);

      // Fetch profile metadata for all contacts
      const contactPubkeys = parsedContacts.map(c => c.pubkey);
      const profiles = await fetchContactProfiles(pool, contactPubkeys);
      setContactProfiles(profiles);

    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch contacts');
    } finally {
      setLoading(false);
      pool.close(memoizedRelays);
    }
  }, [userPubkey, memoizedRelays, parseContactList, fetchContactProfiles]);

  // Create and publish a new contact list event
  const publishContactList = useCallback(async (newContacts: Contact[]) => {
    if (!userPubkey || !userPrivateKey) {
      throw new Error('User public key and private key are required to publish contact list');
    }

    const pool = new SimplePool();

    try {
      // Create tags array from contacts
      const tags = newContacts.map(contact => {
        const tag = ['p', contact.pubkey];
        if (contact.relay) tag.push(contact.relay);
        if (contact.petname) tag.push(contact.petname);
        return tag;
      });

      // Create the event
      const event = {
        kind: 3,
        created_at: Math.floor(Date.now() / 1000),
        tags,
        content: '', // NIP-02 specifies content should be empty
        pubkey: userPubkey
      };

      // Convert private key from hex to Uint8Array if needed
      let privateKeyBytes: Uint8Array;
      if (typeof userPrivateKey === 'string') {
        // Remove 'nsec' prefix if present and decode, otherwise treat as hex
        if (userPrivateKey.startsWith('nsec')) {
          const decoded = nip19.decode(userPrivateKey);
          if (decoded.type === 'nsec') {
            privateKeyBytes = decoded.data;
          } else {
            throw new Error('Invalid nsec private key');
          }
        } else {
          // Treat as hex string
          privateKeyBytes = new Uint8Array(
            userPrivateKey.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []
          );
        }
      } else {
        privateKeyBytes = userPrivateKey;
      }

      // Sign the event using finalizeEvent
      const signedEvent = finalizeEvent(event, privateKeyBytes);

      // Publish to relays
      await pool.publish(memoizedRelays, signedEvent);
      
      console.log('Contact list published successfully');
      
    } catch (err) {
      console.error('Error publishing contact list:', err);
      throw err;
    } finally {
      pool.close(memoizedRelays);
    }
  }, [userPubkey, userPrivateKey, memoizedRelays]);

  // Follow a single pubkey
  const followPubkey = useCallback(async (pubkey: string, relay?: string, petname?: string) => {
    if (!pubkey) {
      throw new Error('Pubkey is required');
    }

    // Check if already following
    const existingContact = contacts.find(c => c.pubkey === pubkey);
    if (existingContact) {
      throw new Error('Already following this pubkey');
    }

    const newContact: Contact = { pubkey, relay, petname };
    const newContacts = [...contacts, newContact];

    try {
      await publishContactList(newContacts);
      setContacts(newContacts);
      
      // Fetch profile for the new contact
      const pool = new SimplePool();
      const profiles = await fetchContactProfiles(pool, [pubkey]);
      setContactProfiles(prev => ({ ...prev, ...profiles }));
      pool.close(memoizedRelays);
      
    } catch (err) {
      console.error('Error following pubkey:', err);
      throw err;
    }
  }, [contacts, publishContactList, fetchContactProfiles, memoizedRelays]);

  // Unfollow a pubkey
  const unfollowPubkey = useCallback(async (pubkey: string) => {
    if (!pubkey) {
      throw new Error('Pubkey is required');
    }

    const newContacts = contacts.filter(c => c.pubkey !== pubkey);

    try {
      await publishContactList(newContacts);
      setContacts(newContacts);
      
      // Remove profile from state
      setContactProfiles(prev => {
        const updated = { ...prev };
        delete updated[pubkey];
        return updated;
      });
      
    } catch (err) {
      console.error('Error unfollowing pubkey:', err);
      throw err;
    }
  }, [contacts, publishContactList]);

  // Follow all pubkeys from a starter pack
  const followStarterPack = useCallback(async (pubkeys: string[], baseRelay?: string) => {
    if (!pubkeys || pubkeys.length === 0) {
      throw new Error('Pubkeys array is required and cannot be empty');
    }

    // Filter out pubkeys that are already being followed
    const newPubkeys = pubkeys.filter(pubkey => !contacts.some(c => c.pubkey === pubkey));
    
    if (newPubkeys.length === 0) {
      throw new Error('All pubkeys from this starter pack are already being followed');
    }

    // Create new contacts for the starter pack pubkeys
    const newContacts = newPubkeys.map(pubkey => ({
      pubkey,
      relay: baseRelay,
      petname: undefined
    }));

    const allContacts = [...contacts, ...newContacts];

    try {
      await publishContactList(allContacts);
      setContacts(allContacts);
      
      // Fetch profiles for the new contacts
      const pool = new SimplePool();
      const profiles = await fetchContactProfiles(pool, newPubkeys);
      setContactProfiles(prev => ({ ...prev, ...profiles }));
      pool.close(memoizedRelays);
      
    } catch (err) {
      console.error('Error following starter pack:', err);
      throw err;
    }
  }, [contacts, publishContactList, fetchContactProfiles, memoizedRelays]);

  // Check if a pubkey is being followed
  const isFollowing = useCallback((pubkey: string): boolean => {
    return contacts.some(c => c.pubkey === pubkey);
  }, [contacts]);

  // Refresh contacts manually
  const refresh = useCallback(() => {
    fetchContacts();
  }, [fetchContacts]);

  // Initial fetch
  useEffect(() => {
    if (userPubkey) {
      fetchContacts();
    }
  }, [fetchContacts, userPubkey]);

  // Auto-sync if enabled
  useEffect(() => {
    if (!enableAutoSync || !userPubkey) return;

    const interval = setInterval(() => {
      fetchContacts();
    }, 30000); // Sync every 30 seconds

    return () => clearInterval(interval);
  }, [enableAutoSync, userPubkey, fetchContacts]);

  return {
    contacts,
    contactProfiles,
    loading,
    error,
    followPubkey,
    unfollowPubkey,
    followStarterPack,
    isFollowing,
    refresh
  };
}
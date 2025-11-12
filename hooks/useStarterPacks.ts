"use client";

import { useEffect, useState, useCallback, useMemo } from 'react';
import { SimplePool, Filter, Event } from 'nostr-tools';

// Author profile interface
interface AuthorProfile {
  name?: string;
  picture?: string;
  about?: string;
}

export interface StarterPack {
  id: string;
  pubkey: string;
  created_at: number;
  identifier: string;
  title?: string;
  description?: string;
  image?: string;
  profiles: string[]; // pubkeys to follow
  author?: AuthorProfile;
}

export interface UseStarterPacksOptions {
  predefinedPacks?: string[]; // specific event IDs or identifiers to fetch
  limit?: number;
  relays?: string[];
}

export interface UseStarterPacksReturn {
  starterPacks: StarterPack[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

// Default relays to use for fetching starter packs
const DEFAULT_RELAYS = [
  'wss://relay.damus.io',
  'wss://relay.primal.net',
  'wss://relay.nostr.band',
  'wss://nos.lol'
];

export function useStarterPacks(options: UseStarterPacksOptions = {}): UseStarterPacksReturn {
  const [starterPacks, setStarterPacks] = useState<StarterPack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize options to prevent unnecessary re-renders
  const {
    predefinedPacks,
    limit = 20,
    relays = DEFAULT_RELAYS
  } = options;

  // Memoize the relays array to prevent dependency changes
  const memoizedRelays = useMemo(() => relays, [JSON.stringify(relays)]);
  
  // Memoize predefinedPacks array to prevent dependency changes  
  const memoizedPredefinedPacks = useMemo(() => predefinedPacks, [JSON.stringify(predefinedPacks)]);

  const parseStarterPack = useCallback((event: Event): StarterPack | null => {
    try {
      // Extract metadata from tags
      let identifier = '';
      let title = '';
      let description = '';
      let image = '';
      const profiles: string[] = [];

      for (const tag of event.tags) {
        switch (tag[0]) {
          case 'd':
            identifier = tag[1] || '';
            break;
          case 'title':
            title = tag[1] || '';
            break;
          case 'description':
            description = tag[1] || '';
            break;
          case 'image':
            image = tag[1] || '';
            break;
          case 'p':
            if (tag[1]) {
              profiles.push(tag[1]);
            }
            break;
        }
      }

      // Use content as description if no description tag exists
      if (!description && event.content) {
        description = event.content;
      }

      return {
        id: event.id,
        pubkey: event.pubkey,
        created_at: event.created_at,
        identifier,
        title: title || identifier || 'Untitled Pack',
        description,
        image,
        profiles
      };
    } catch (err) {
      console.error('Failed to parse starter pack:', err);
      return null;
    }
  }, []);

  const fetchAuthorMetadata = useCallback(async (pool: SimplePool, pubkeys: Set<string>) => {
    const filter: Filter = {
      kinds: [0], // Profile metadata
      authors: Array.from(pubkeys)
    };

    const profiles: Record<string, AuthorProfile> = {};
    const events = await pool.querySync(memoizedRelays, filter);
    
    for (const event of events) {
      try {
        const profile = JSON.parse(event.content);
        profiles[event.pubkey] = {
          name: profile.name || profile.display_name,
          picture: profile.picture,
          about: profile.about
        };
      } catch (err) {
        console.error('Failed to parse profile metadata:', err);
      }
    }

    return profiles;
  }, [memoizedRelays]);

  const fetchStarterPacks = useCallback(async () => {
    setLoading(true);
    setError(null);

    const pool = new SimplePool();

    try {
      let filter: Filter;

      if (memoizedPredefinedPacks && memoizedPredefinedPacks.length > 0) {
        // Fetch specific starter packs by ID or identifier
        filter = {
          kinds: [39089], // Starter packs
          limit,
          '#d': memoizedPredefinedPacks // Filter by identifiers
        };
      } else {
        // Fetch newest starter packs
        filter = {
          kinds: [39089], // Starter packs
          limit,
          since: Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60) // Last 30 days
        };
      }

      const events = await pool.querySync(memoizedRelays, filter);
      
      // Sort by creation time (newest first)
      events.sort((a, b) => b.created_at - a.created_at);

      // Parse starter packs
      const parsedPacks: StarterPack[] = [];
      const authorPubkeys = new Set<string>();

      for (const event of events) {
        const pack = parseStarterPack(event);
        if (pack && pack.profiles.length > 0) {
          parsedPacks.push(pack);
          authorPubkeys.add(pack.pubkey);
        }
      }

      // Fetch author metadata
      const authorProfiles = await fetchAuthorMetadata(pool, authorPubkeys);

      // Add author metadata to packs
      const packsWithAuthors = parsedPacks.map(pack => ({
        ...pack,
        author: authorProfiles[pack.pubkey]
      }));

      setStarterPacks(packsWithAuthors);
    } catch (err) {
      console.error('Error fetching starter packs:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch starter packs');
    } finally {
      setLoading(false);
      pool.close(memoizedRelays);
    }
  }, [memoizedPredefinedPacks, limit, memoizedRelays, parseStarterPack, fetchAuthorMetadata]);

  const refresh = useCallback(() => {
    fetchStarterPacks();
  }, [fetchStarterPacks]);

  useEffect(() => {
    fetchStarterPacks();
  }, [fetchStarterPacks]);

  return {
    starterPacks,
    loading,
    error,
    refresh
  };
}
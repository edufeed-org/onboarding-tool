import { type NostrEvent } from '@nostrify/nostrify';
import { useNostr } from '@nostrify/react';
import { useQuery } from '@tanstack/react-query';

export interface StarterPackProfile {
  pubkey: string;
  relay?: string;
  petname?: string;
}

export interface StarterPack {
  event: NostrEvent;
  identifier: string;
  title?: string;
  description?: string;
  image?: string;
  profiles: StarterPackProfile[];
}

/**
 * Hook to fetch all NIP-51 starter packs (kind 39089) available on the network
 * This queries all starter packs without filtering by specific identifiers
 */
export function useAllStarterPacks() {
  const { nostr } = useNostr();

  return useQuery<StarterPack[]>({
    queryKey: ['all-starter-packs'],
    queryFn: async ({ signal }) => {
      const timeoutSignal = AbortSignal.timeout(3000);
      const combinedSignal = AbortSignal.any([signal, timeoutSignal]);

      // Query all starter packs (kind 39089) without filtering by author
      const events = await nostr.query(
        [
          {
            kinds: [39089],
            limit: 50,
          },
        ],
        { signal: combinedSignal }
      );

      // Parse each event into a StarterPack object
      const starterPacks: StarterPack[] = events
        .map((event): StarterPack | null => {
          // Extract d tag (identifier)
          const dTag = event.tags.find(([name]) => name === 'd')?.[1];
          if (!dTag) return null;

          // Extract optional metadata tags
          const title = event.tags.find(([name]) => name === 'title')?.[1];
          const description = event.tags.find(([name]) => name === 'description')?.[1];
          const image = event.tags.find(([name]) => name === 'image')?.[1];

          // Extract profile tags (p tags)
          const profiles: StarterPackProfile[] = event.tags
            .filter(([name]) => name === 'p')
            .map(([, pubkey, relay, petname]) => ({
              pubkey,
              relay,
              petname,
            }))
            .filter((profile) => profile.pubkey); // Ensure pubkey exists

          return {
            event,
            identifier: dTag,
            title,
            description,
            image,
            profiles,
          };
        })
        .filter((pack): pack is StarterPack => pack !== null);

      return starterPacks;
    },
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
    retry: 2,
  });
}

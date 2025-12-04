import { type NostrEvent } from '@nostrify/nostrify';
import { useNostr } from '@nostrify/react';
import { useQuery } from '@tanstack/react-query';

// Hardcoded starter pack identifiers - these can be configured per deployment
const STARTER_PACK_IDENTIFIERS = [
  // https://following.space/d/p9ny0auxlpoa?p=d6d214fe27fcc0a691dd0f04d152b7cdda7f61f96f26dc421df46af0bb51792e
  {
    kind: 39089,
    pubkey: 'd6d214fe27fcc0a691dd0f04d152b7cdda7f61f96f26dc421df46af0bb51792e', // Example (Freie Bildungsflotte)
    identifier: 'p9ny0auxlpoa',
  },
];

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
 * Hook to fetch NIP-51 starter packs (kind 39089)
 * Starter packs are named sets of profiles to be followed together
 */
export function useStarterPacks() {
  const { nostr } = useNostr();

  return useQuery<StarterPack[]>({
    queryKey: ['starter-packs', STARTER_PACK_IDENTIFIERS],
    queryFn: async ({ signal }) => {
      const timeoutSignal = AbortSignal.timeout(3000);
      const combinedSignal = AbortSignal.any([signal, timeoutSignal]);

      // Build filters for all starter packs
      const filters = STARTER_PACK_IDENTIFIERS.map((pack) => ({
        kinds: [pack.kind],
        authors: [pack.pubkey],
        '#d': [pack.identifier],
        limit: 1,
      }));

      // Query all starter packs at once
      const events = await nostr.query(filters, { signal: combinedSignal });

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

import { type NostrEvent } from '@nostrify/nostrify';
import { useNostr } from '@nostrify/react';
import { useQuery } from '@tanstack/react-query';
import { useCurrentUser } from './useCurrentUser';

/**
 * Hook to fetch kind 1 notes filtered by the user's interest set (kind 10015) hashtags.
 * Returns notes that match any of the hashtags from the user's interest list.
 */
export function useNotes() {
  const { nostr } = useNostr();
  const { user } = useCurrentUser();

  return useQuery<NostrEvent[]>({
    queryKey: ['notes', user?.pubkey],
    queryFn: async ({ signal }) => {
      // First, fetch the user's interest list (kind 10015)
      const [interestList] = await nostr.query(
        [{ kinds: [10015], authors: user?.pubkey ? [user.pubkey] : [], limit: 1 }],
        { signal: AbortSignal.any([signal, AbortSignal.timeout(1500)]) }
      );

      // Extract hashtags from the interest list
      const hashtags = interestList?.tags
        .filter(([name]) => name === 't')
        .map(([, value]) => value) ?? [];

      // If no hashtags found, return empty array
      if (hashtags.length === 0) {
        return [];
      }

      // Query for kind 1 notes that have any of the user's interest hashtags
      const notes = await nostr.query(
        [
          {
            kinds: [1],
            '#t': hashtags,
            limit: 50,
          },
        ],
        { signal: AbortSignal.any([signal, AbortSignal.timeout(3000)]) }
      );

      // Sort by creation time, newest first
      return notes.sort((a, b) => b.created_at - a.created_at);
    },
    enabled: !!user?.pubkey,
    staleTime: 30 * 1000, // 30 seconds
    retry: 2,
  });
}

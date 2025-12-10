import { useQuery } from '@tanstack/react-query';
import { useNostr } from '@nostrify/react';
import { useCurrentUser } from './useCurrentUser';

/**
 * Hook to fetch the current user's follow list (kind 3)
 * Returns an array of pubkeys that the user follows
 */
export function useFollowList() {
  const { nostr } = useNostr();
  const { user } = useCurrentUser();

  return useQuery<string[]>({
    queryKey: ['follow-list', user?.pubkey],
    queryFn: async ({ signal }) => {
      if (!user?.pubkey) return [];
      
      const [followEvent] = await nostr.query(
        [{ kinds: [3], authors: [user.pubkey], limit: 1 }],
        { signal: AbortSignal.any([signal, AbortSignal.timeout(2000)]) }
      );
      
      if (!followEvent) return [];

      // Extract pubkeys from p tags
      const followedPubkeys = followEvent.tags
        .filter(([name]) => name === 'p')
        .map(([, pubkey]) => pubkey);

      return followedPubkeys;
    },
    enabled: !!user?.pubkey,
    staleTime: 60 * 1000, // Cache for 1 minute
    retry: 2,
  });
}

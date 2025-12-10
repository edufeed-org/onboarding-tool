import { useQuery } from '@tanstack/react-query';
import { useNostr } from '@nostrify/react';
import type { NostrEvent } from '@nostrify/nostrify';

export interface KanbanBoard {
  id: string;
  title: string;
  description?: string;
  pubState: string;
  event: NostrEvent;
}

function parseKanbanBoard(event: NostrEvent): KanbanBoard | null {
  const dTag = event.tags.find(([name]) => name === 'd')?.[1];
  const title = event.tags.find(([name]) => name === 'title')?.[1];
  
  // Required tags validation
  if (!dTag || !title) {
    return null;
  }

  const description = event.tags.find(([name]) => name === 'description')?.[1];
  const pubState = event.tags.find(([name]) => name === 'pub')?.[1] || 'private';

  return {
    id: `${event.kind}:${event.pubkey}:${dTag}`,
    title,
    description,
    pubState,
    event,
  };
}

export function useKanbanBoards() {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['kanban-boards'],
    queryFn: async (c) => {
      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(3000)]);
      
      // Query kind 30301 events (Kanban boards)
      const events = await nostr.query(
        [{ kinds: [30301], limit: 50 }],
        { signal }
      );

      // Parse and filter valid boards
      const boards = events
        .map(parseKanbanBoard)
        .filter((board): board is KanbanBoard => board !== null)
        // Sort by creation time (newest first)
        .sort((a, b) => b.event.created_at - a.event.created_at);

      return boards;
    },
  });
}

import { useQuery } from '@tanstack/react-query';
import { useNostr } from '@nostrify/react';
import type { NostrEvent } from '@nostrify/nostrify';
import { nip19 } from 'nostr-tools';

export interface KanbanColumn {
  id: string;
  name: string;
  order: number;
}

export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  columnId: string;
  columnLabel?: string;
  rank: number;
  pubState: string;
  assignees: string[];
  attachments: string[];
  event: NostrEvent;
}

export interface KanbanBoardDetail {
  id: string;
  title: string;
  description?: string;
  pubState: string;
  columns: KanbanColumn[];
  cards: KanbanCard[];
  maintainers: string[];
  event: NostrEvent;
}

function parseKanbanColumn(tag: string[]): KanbanColumn | null {
  if (tag[0] !== 'col' || tag.length < 4) return null;
  
  return {
    id: tag[1],
    name: tag[2],
    order: parseInt(tag[3], 10) || 0,
  };
}

function parseKanbanCard(event: NostrEvent): KanbanCard | null {
  const dTag = event.tags.find(([name]) => name === 'd')?.[1];
  const title = event.tags.find(([name]) => name === 'title')?.[1];
  const columnId = event.tags.find(([name]) => name === 's')?.[1];
  
  // Required tags validation
  if (!dTag || !title || !columnId) {
    return null;
  }

  const description = event.tags.find(([name]) => name === 'description')?.[1];
  const columnLabel = event.tags.find(([name]) => name === 'col_label')?.[1];
  const rankTag = event.tags.find(([name]) => name === 'rank')?.[1];
  const rank = rankTag ? parseInt(rankTag, 10) : 0;
  const pubState = event.tags.find(([name]) => name === 'pub')?.[1] || 'private';
  
  const assignees = event.tags
    .filter(([name]) => name === 'p')
    .map(([_, pubkey]) => pubkey);
  
  const attachments = event.tags
    .filter(([name]) => name === 'u')
    .map(([_, url]) => url);

  return {
    id: `${event.kind}:${event.pubkey}:${dTag}`,
    title,
    description,
    columnId,
    columnLabel,
    rank,
    pubState,
    assignees,
    attachments,
    event,
  };
}

export function useKanbanBoard(boardId: string) {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['kanban-board', boardId],
    queryFn: async (c) => {
      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(3000)]);
      
      // Parse the boardId - could be an naddr or "kind:pubkey:d-tag"
      let kind: number;
      let pubkey: string;
      let dTag: string;

      if (boardId.startsWith('naddr1')) {
        // Decode naddr
        try {
          const decoded = nip19.decode(boardId);
          if (decoded.type !== 'naddr') {
            throw new Error('Invalid naddr identifier');
          }
          const naddr = decoded.data;
          kind = naddr.kind;
          pubkey = naddr.pubkey;
          dTag = naddr.identifier;
        } catch (error) {
          throw new Error('Failed to decode naddr');
        }
      } else {
        // Parse "kind:pubkey:d-tag" format
        const parts = boardId.split(':');
        if (parts.length !== 3) {
          throw new Error('Invalid board ID format');
        }
        kind = parseInt(parts[0], 10);
        pubkey = parts[1];
        dTag = parts[2];
      }

      // Query the board event (kind 30301)
      const [boardEvent] = await nostr.query(
        [{
          kinds: [kind],
          authors: [pubkey],
          '#d': [dTag],
          limit: 1,
        }],
        { signal }
      );

      if (!boardEvent) {
        throw new Error('Board not found');
      }

      // Parse board details
      const title = boardEvent.tags.find(([name]) => name === 'title')?.[1];
      if (!title) {
        throw new Error('Invalid board: missing title');
      }

      const description = boardEvent.tags.find(([name]) => name === 'description')?.[1];
      const pubState = boardEvent.tags.find(([name]) => name === 'pub')?.[1] || 'private';
      
      const columns = boardEvent.tags
        .map(parseKanbanColumn)
        .filter((col): col is KanbanColumn => col !== null)
        .sort((a, b) => a.order - b.order);

      const maintainers = boardEvent.tags
        .filter(([name]) => name === 'p')
        .map(([_, pubkey]) => pubkey);

      // Query cards for this board (kind 30302)
      const cardEvents = await nostr.query(
        [{
          kinds: [30302],
          '#a': [`30301:${pubkey}:${dTag}`],
          limit: 100,
        }],
        { signal }
      );

      const cards = cardEvents
        .map(parseKanbanCard)
        .filter((card): card is KanbanCard => card !== null)
        .sort((a, b) => a.rank - b.rank);

      const boardDetail: KanbanBoardDetail = {
        id: boardId,
        title,
        description,
        pubState,
        columns,
        cards,
        maintainers,
        event: boardEvent,
      };

      return boardDetail;
    },
    enabled: !!boardId,
  });
}

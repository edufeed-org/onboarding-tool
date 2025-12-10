import { type NostrEvent } from '@nostrify/nostrify';
import { useNostr } from '@nostrify/react';
import { useQuery } from '@tanstack/react-query';

interface InterestSetPointer {
  kind: number;
  pubkey: string;
  identifier: string;
}

interface InterestSetConfig {
  /** Stable identifier for React list rendering and fallback usage. */
  id: string;
  title: string;
  description?: string;
  image?: string;
  hashtags: string[];
  pointer?: InterestSetPointer;
}

const INTEREST_SET_CONFIGS: InterestSetConfig[] = [
  {
    id: 'lernen-bildung',
    title: 'Lernen & Bildung',
    description: 'Kuratiert Inhalte rund um offene Bildung, Lerncommunities und moderne Didaktik.',
    hashtags: ['bildung', 'lernen', 'edtech', 'openlearning'],
  },
  {
    id: 'culture-civic',
    title: 'Kultur & Gesellschaft',
    description: 'Finde Stimmen zu Kulturwandel, digitaler Teilhabe und kreativen Commons.',
    hashtags: ['kultur', 'commons', 'civictech', 'community', 'fedi'],
  },
  {
    id: 'edufeed',
    title: 'EduFeed',
    description: 'Folge Projekten bzgl. EduFeed',
    hashtags: ['edufeed', 'edufeed-de', 'eduDE' ],
  },
];

export interface InterestSet {
  id: string;
  title: string;
  description?: string;
  image?: string;
  hashtags: string[];
  pointer?: InterestSetPointer;
  event?: NostrEvent;
  pointerValue?: string;
}

function buildPointerValue(pointer?: InterestSetPointer) {
  if (!pointer) return undefined;
  return `${pointer.kind}:${pointer.pubkey}:${pointer.identifier}`;
}

export function useInterestSets() {
  const { nostr } = useNostr();

  return useQuery<InterestSet[]>({
    queryKey: ['interest-sets', INTEREST_SET_CONFIGS],
    queryFn: async ({ signal }) => {
      const pointerConfigs = INTEREST_SET_CONFIGS.filter((config) => config.pointer);
      const timeoutSignal = AbortSignal.timeout(3000);
      const combinedSignal = AbortSignal.any([signal, timeoutSignal]);

      let events: NostrEvent[] = [];

      if (pointerConfigs.length > 0) {
        const filters = pointerConfigs.map((config) => ({
          kinds: [config.pointer!.kind],
          authors: [config.pointer!.pubkey],
          '#d': [config.pointer!.identifier],
          limit: 1,
        }));

        try {
          events = await nostr.query(filters, { signal: combinedSignal });
        } catch {
          // Prefer graceful fallback to the configured defaults when relays time out.
        }
      }

      const eventMap = new Map<string, NostrEvent>();
      events.forEach((event) => {
        const identifier = event.tags.find(([name]) => name === 'd')?.[1];
        if (!identifier) return;
        eventMap.set(`${event.pubkey}:${identifier}`, event);
      });

      return INTEREST_SET_CONFIGS.map((config) => {
        const eventKey = config.pointer
          ? `${config.pointer.pubkey}:${config.pointer.identifier}`
          : undefined;
        const event = eventKey ? eventMap.get(eventKey) : undefined;

        const title = event?.tags.find(([name]) => name === 'title')?.[1] ?? config.title;
        const description = event?.tags.find(([name]) => name === 'description')?.[1] ?? config.description;
        const image = event?.tags.find(([name]) => name === 'image')?.[1] ?? config.image;
        const hashtags = event
          ? event.tags.filter(([name]) => name === 't').map(([, value]) => value).filter(Boolean)
          : config.hashtags;

        return {
          id: config.id,
          title,
          description,
          image,
          hashtags,
          pointer: config.pointer,
          event,
          pointerValue: buildPointerValue(config.pointer ?? (event ? {
            kind: event.kind,
            pubkey: event.pubkey,
            identifier: event.tags.find(([name]) => name === 'd')?.[1] ?? config.id,
          } : undefined)),
        } satisfies InterestSet;
      }).filter((set) => set.hashtags.length > 0);
    },
    staleTime: 10 * 60 * 1000,
    retry: 2,
  });
}

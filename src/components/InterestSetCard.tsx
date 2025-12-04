import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Sparkles, Check } from 'lucide-react';
import { useNostr } from '@nostrify/react';

import { type InterestSet } from '@/hooks/useInterestSets';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useNostrPublish } from '@/hooks/useNostrPublish';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface InterestSetCardProps {
  interestSet: InterestSet;
}

export function InterestSetCard({ interestSet }: InterestSetCardProps) {
  const { user } = useCurrentUser();
  const { nostr } = useNostr();
  const { mutate: publish, isPending: isPublishing } = useNostrPublish();
  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();

  const { data: interestList } = useQuery({
    queryKey: ['interest-list', user?.pubkey],
    queryFn: async ({ signal }) => {
      if (!user?.pubkey) return null;

      const [event] = await nostr.query(
        [{ kinds: [10015], authors: [user.pubkey], limit: 1 }],
        { signal: AbortSignal.any([signal, AbortSignal.timeout(1500)]) }
      );

      return event ?? null;
    },
    enabled: !!user?.pubkey,
    staleTime: 60 * 1000,
  });

  const hashtags = interestSet.hashtags;
  const existingHashtags = interestList?.tags
    .filter(([name]) => name === 't')
    .map(([, value]) => value) ?? [];
  const existingPointers = interestList?.tags
    .filter(([name]) => name === 'a')
    .map(([, value]) => value) ?? [];

  const pointerValue = interestSet.pointerValue;
  const alreadyFollowingCount = hashtags.filter((tag) => existingHashtags.includes(tag)).length;
  const isPointerFollowed = pointerValue ? existingPointers.includes(pointerValue) : false;
  const isFullyFollowing = (hashtags.length > 0 && alreadyFollowingCount === hashtags.length) || isPointerFollowed;
  const missingHashtags = hashtags.filter((tag) => !existingHashtags.includes(tag));

  const handleFollowSet = () => {
    if (!user || hashtags.length === 0) return;

    setIsUpdating(true);

    const retainedTags = interestList?.tags.filter(([name]) => name !== 't' && name !== 'a') ?? [];
    const currentTTags = interestList?.tags.filter(([name]) => name === 't') ?? [];
    const currentATags = interestList?.tags.filter(([name]) => name === 'a') ?? [];

    const newTags: string[][] = [
      ...retainedTags,
      ...currentTTags,
      ...missingHashtags.map((tag) => ['t', tag] as [string, string]),
      ...currentATags,
    ];

    if (pointerValue && !isPointerFollowed) {
      newTags.push(['a', pointerValue]);
    }

    publish(
      {
        kind: 10015,
        content: interestList?.content ?? '',
        tags: newTags,
      },
      {
        onSettled: () => {
          setIsUpdating(false);
          if (user?.pubkey) {
            queryClient.invalidateQueries({ queryKey: ['interest-list', user.pubkey] });
          }
        },
      }
    );
  };

  return (
    <Card className="border-2 hover:shadow-lg transition-all h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg line-clamp-2">
              {interestSet.title}
            </CardTitle>
            {interestSet.description && (
              <CardDescription className="mt-1.5 line-clamp-3">
                {interestSet.description}
              </CardDescription>
            )}
          </div>
          <Badge variant="secondary" className="gap-1.5 whitespace-nowrap">
            <Sparkles className="h-3 w-3" />
            {hashtags.length} Themen
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {hashtags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs font-medium">
              #{tag}
            </Badge>
          ))}
        </div>

        <Button
          onClick={handleFollowSet}
          disabled={!user || isPublishing || isUpdating || isFullyFollowing}
          className="w-full"
          variant={isFullyFollowing ? 'outline' : 'default'}
        >
          {isFullyFollowing ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Bereits abonniert
            </>
          ) : isPublishing || isUpdating ? (
            <>Wird aktualisiert...</>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Interesse folgen
            </>
          )}
        </Button>

        {!user && (
          <p className="text-xs text-center text-muted-foreground">
            Melde dich an, um Themen zu abonnieren
          </p>
        )}

        {alreadyFollowingCount > 0 && !isFullyFollowing && (
          <p className="text-xs text-muted-foreground text-center">
            {alreadyFollowingCount} Hashtags folgst du bereits
          </p>
        )}
      </CardContent>
    </Card>
  );
}

import { InterestSetCard } from '@/components/InterestSetCard';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { InterestSet } from '@/hooks/useInterestSets';
import { Sparkles } from 'lucide-react';

interface InterestSetsSectionProps {
  interestSets?: InterestSet[] | null;
  isLoading: boolean;
  isError: boolean;
}

function InterestSetSkeleton() {
  return (
    <Card className="border-2 h-full">
      <div className="p-6 space-y-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />

        <div className="flex flex-wrap gap-2 pt-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-6 w-16 rounded-full" />
          ))}
        </div>

        <Skeleton className="h-10 w-full" />
      </div>
    </Card>
  );
}

export function InterestSetsSection({ interestSets, isLoading, isError }: InterestSetsSectionProps) {
  const hasInterestSets = !!interestSets && interestSets.length > 0;
  const shouldRenderSection = isLoading || isError || hasInterestSets;

  if (!shouldRenderSection) {
    return null;
  }

  return (
    <section>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center p-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg">
            <Sparkles className="h-6 w-6 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold">Kuratiere deine Interessen</h2>
        </div>
        <p className="text-muted-foreground">
          Wähle thematische Hashtag-Sets aus, damit wir deine Feeds direkt passgenau filtern.
        </p>
      </div>

      {isError && (
        <Card className="border-dashed">
          <CardContent className="py-12 px-8 text-center">
            <div className="max-w-sm mx-auto space-y-4">
              <p className="text-muted-foreground">
                Interessen konnten nicht geladen werden. Prüfe deine Relays oder versuche es später erneut.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <InterestSetSkeleton key={`interest-skeleton-${i}`} />
          ))}
        </div>
      )}

      {!isLoading && hasInterestSets && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interestSets.map((interestSet) => (
            <InterestSetCard key={interestSet.id} interestSet={interestSet} />
          ))}
        </div>
      )}
    </section>
  );
}

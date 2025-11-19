import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StarterPackCard } from "@/components/StarterPackCard";
import { useStarterPacks } from "@/hooks/useStarterPacks";
import { Users } from "lucide-react";

function StarterPackSkeleton() {
  return (
    <Card className="border-2 h-full">
      <div className="p-6 space-y-4">
        {/* Image skeleton */}
        <Skeleton className="w-full h-32 rounded-lg" />
        
        {/* Title and description */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Badge */}
        <Skeleton className="h-6 w-24" />

        {/* Profile previews */}
        <div className="space-y-2 pt-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>

        {/* Button skeleton */}
        <Skeleton className="h-10 w-full" />
      </div>
    </Card>
  );
}

export function StarterPacksSection() {
  const { data: starterPacks, isLoading, isError } = useStarterPacks();

  // Don't show section if there are no packs and loading is complete
  if (!isLoading && (!starterPacks || starterPacks.length === 0)) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto mb-12">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center p-2 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-lg">
            <Users className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold">Empfohlene Starter Packs</h2>
        </div>
        <p className="text-muted-foreground">
          Folge kuratierten Listen interessanter Profile, um schnell loszulegen
        </p>
      </div>

      {isError && (
        <Card className="border-dashed">
          <CardContent className="py-12 px-8 text-center">
            <div className="max-w-sm mx-auto space-y-4">
              <p className="text-muted-foreground">
                Starter Packs konnten nicht geladen werden. Bitte versuche es später erneut.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <StarterPackSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoading && starterPacks && starterPacks.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {starterPacks.map((pack) => (
            <StarterPackCard key={pack.event.id} pack={pack} />
          ))}
        </div>
      )}
    </div>
  );
}

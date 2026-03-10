import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StarterPackCard } from "@/components/StarterPackCard";
import { useAllStarterPacks } from "@/hooks/useAllStarterPacks";
import { Users } from "lucide-react";
import { useSeoMeta } from '@unhead/react';
import { PageHeader } from "@/components/PageHeader";
import { OnboardingProgressBar } from "@/components/OnboardingProgressBar";
import { Button } from "@/components/ui/button";

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

export default function StarterPacksPage() {
  const {
    data: starterPacks,
    isLoading: isLoadingPacks,
    isError: isPacksError,
  } = useAllStarterPacks();

  useSeoMeta({
    title: 'Browse Starter Packs - Nostr Onboarding',
    description: 'Explore curated lists of interesting profiles to follow on Nostr',
  });

  return (
    <div className="min-h-screen bg-background">
      <PageHeader />
      
      {/* Progress Bar */}
      <div className="container mx-auto pt-8">
        <OnboardingProgressBar currentStep={6} />
      </div>

      <div className="container mx-auto px-4 py-20">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center space-y-6 mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-full">
            <Users className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
            Entdecke Starter Packs
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Folge kuratierten Listen interessanter Profile, um schnell loszulegen und die Nostr-Community zu entdecken
          </p>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto">
          {isPacksError && (
            <Card className="border-dashed">
              <CardContent className="py-12 px-8 text-center">
                <div className="max-w-sm mx-auto space-y-4">
                  <p className="text-muted-foreground">
                    Starter Packs konnten nicht geladen werden. Bitte überprüfe deine Relay-Verbindungen oder versuche es später erneut.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {isLoadingPacks && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <StarterPackSkeleton key={`pack-skeleton-${i}`} />
              ))}
            </div>
          )}

          {!isLoadingPacks && starterPacks && starterPacks.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {starterPacks.map((pack) => (
                <StarterPackCard key={pack.event.id} pack={pack} />
              ))}
            </div>
          )}

          {!isLoadingPacks && starterPacks && starterPacks.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="py-12 px-8 text-center">
                <div className="max-w-sm mx-auto space-y-4">
                  <p className="text-muted-foreground">
                    Keine Starter Packs gefunden. Überprüfe deine Relay-Verbindungen oder warte einen Moment, bis Inhalte geladen werden.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4 mt-12">
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            size="lg"
            className="px-8 py-6 text-base font-semibold"
          >
            Zurück
          </Button>
        </div>
      </div>
    </div>
  );
}

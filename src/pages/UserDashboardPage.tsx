import { User } from "lucide-react";
import { useSeoMeta } from '@unhead/react';
import { InterestSetsSection } from "@/components/InterestSetsSection";
import { useInterestSets } from "@/hooks/useInterestSets";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

export default function UserDashboardPage() {
  const navigate = useNavigate();
  const {
    data: interestSets,
    isLoading: isLoadingInterests,
    isError: isInterestsError,
  } = useInterestSets();

  useSeoMeta({
    title: 'Dashboard - Nostr Onboarding',
    description: 'Dein persönliches Nostr Dashboard.',
  });

  const shouldShowInterestSection =
    isLoadingInterests || isInterestsError || (!!interestSets && interestSets.length > 0);


  return (
    <div className="min-h-screen bg-background">
      <PageHeader />

      <div className="container mx-auto px-4 py-20">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center space-y-6 mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full">
            <User className="h-12 w-12 text-purple-600" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
            Willkommen bei{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              edufeed
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Du hast erfolgreich dein Nostr-Schlüsselpaar erstellt. 
            Jetzt kannst du die dezentrale Welt erkunden!
          </p>
        </div>

        {/* Starter Packs Section */}

        {shouldShowInterestSection && (
          <div className="max-w-5xl mx-auto mb-12">
            <InterestSetsSection
              interestSets={interestSets}
              isLoading={isLoadingInterests}
              isError={isInterestsError}
            />
          </div>
        )}
      </div>
      <div className="flex justify-center gap-4">
        <Button
          onClick={() => navigate('/starter-packs')}
          size="lg"
          className="group relative overflow-hidden px-8 py-6 text-base font-semibold"
        >
          <span className="relative flex items-center gap-2">
            Starterpacks entdecken
          </span>
        </Button>
        <Button
          onClick={() => navigate('/edit-profile')}
          variant="outline"
          size="lg"
          className="px-8 py-6 text-base font-semibold"
        >
          <User className="h-5 w-5" />
          Profil bearbeiten
        </Button>
      </div>
    </div>
  );
}

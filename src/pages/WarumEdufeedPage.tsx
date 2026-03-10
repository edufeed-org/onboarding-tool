import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { OnboardingProgressBar } from '@/components/OnboardingProgressBar';
import { PageHeader } from '@/components/PageHeader';
import { Search, Share2, Users, Shield } from 'lucide-react';

export default function WarumEdufeedPage() {
  const navigate = useNavigate();

  const advantages = [
    {
      title: 'Inhalte entdecken',
      description: 'Finde Bildungsinhalte aus verschiedenen Plattformen in einem gemeinsamen Feed.',
      icon: Search,
    },
    {
      title: 'Wissen teilen',
      description: 'Teile eigene Materialien und Beiträge mit einer offenen Community.',
      icon: Share2,
    },
    {
      title: 'Communities aufbauen',
      description: 'Vernetze dich mit Menschen, Projekten und Themen, die dich interessieren.',
      icon: Users,
    },
    {
      title: 'Deine Inhalte bleiben erhalten',
      description: 'Beiträge werden dezentral gespeichert und sind auf allen EduFeed-Instanzen verfügbar.',
      icon: Shield,
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <PageHeader />
      
      <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
        {/* Progress Bar */}
        <OnboardingProgressBar currentStep={2} className="mb-12" />
        
        {/* Header Section */}
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Warum Edufeed?
          </h1>
          <p className="text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto">
            EduFeed verbindet Inhalte, Menschen und Communities rund um Bildung und Wissen.
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-16">
          {advantages.map((advantage) => {
            return (
              <div className="flex gap-4" key={advantage.title}>
                <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-lg h-fit min-w-[56px]">
                  <advantage.icon className="h-7 w-7 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-xl font-bold">
                    {advantage.title}
                  </h3>
                  <p className="text-xl text-muted-foreground pb-5">
                    {advantage.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Value Proposition Section */}


        {/* CTA Section */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            size="lg"
            className="px-8 py-6 text-base font-semibold"
          >
            Zurück
          </Button>
          <Button
            onClick={() => navigate('/register?type=user')}
            size="lg"
            className="group relative overflow-hidden px-8 py-6 text-base font-semibold"
          >
            <span className="relative flex items-center gap-2">
              Weiter
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
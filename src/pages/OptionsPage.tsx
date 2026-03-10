import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PageHeader } from "@/components/PageHeader";
import { OnboardingProgressBar } from "@/components/OnboardingProgressBar";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Rss, Kanban, Calendar, Network } from "lucide-react";

export default function PlatformDashboardPage() {
  const navigate = useNavigate();
  const { user } = useCurrentUser();

  const resources = [
    {
      title: "Feed & Inhalte entdecken",
      description: "Finde Bildungsinhalte aus verschiedenen Plattformen in einem gemeinsamen Feed.",
      link: "https://rpi.edufeed.org/discover",
      icon: Rss,
    },
    {
      title: "Projekte organisieren",
      description: "Nutze Kanban-Boards, um Projekte zu strukturieren und gemeinsam daran zu arbeiten.",
      link: "https://kanban.edufeed.org",
      icon: Kanban,
    },
    {
      title: "Events und Termine planen",
      description: "Behalte Veranstaltungen im Blick und organisiere Termine mit dem integrierten Kalender.",
      link: "https://rpi.edufeed.org/calendar",
      icon: Calendar,
    },
    {
      title: "Diskussionen visualisieren",
      description: "Mit EduGalaxy kannst du Diskussionen und Zusammenhänge zwischen Themen sichtbar machen.",
      link: "http://map.edufeed.org/",
      icon: Network,
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <PageHeader />
      
      {/* Progress Bar */}
      <div className="container mx-auto pt-8">
        <OnboardingProgressBar currentStep={4} />
      </div>

      <div className="container mx-auto px-4 py-20">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-6 mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
            Was du mit EduFeed machen kannst
          </h1>
          <p className="text-xl text-muted-foreground">
            EduFeed bietet verschiedene Werkzeuge, um Inhalte zu entdecken, Wissen zu teilen und gemeinsam an Projekten zu arbeiten.
          </p>
        </div>

        {/* Quick Links */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="grid md:grid-cols-2 gap-4">
            {resources.map((resource, index) => (
              <a
                key={index}
                href={resource.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Card className="border-2 hover:shadow-lg transition-all hover:border-primary">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-lg min-w-[48px]">
                          <resource.icon className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-bold">{resource.title}</CardTitle>
                          <CardDescription className="text-sm mt-1">
                            {resource.description}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-4">
        <Button
          onClick={() => navigate(user ? '/warum-edufeed' : '/register')}
          variant="outline"
          size="lg"
          className="px-8 py-6 text-base font-semibold"
        >
          Zurück
        </Button>
        <Button
          onClick={() => navigate('/user-dashboard')}
          size="lg"
          className="group relative overflow-hidden px-8 py-6 text-base font-semibold"
        >
          <span className="relative flex items-center gap-2">
            Weiter
          </span>
        </Button>
      </div>
    </div>
  );
}

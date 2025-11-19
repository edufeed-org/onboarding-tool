import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/hooks/useTheme";
import { Moon, Sun, ArrowRight, Calendar, MessageSquare, Wallet, Users, FileText, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { useSeoMeta } from '@unhead/react';

export default function FeaturesPage() {
  const { theme, setTheme } = useTheme();

  useSeoMeta({
    title: 'Features - Nostr Onboarding',
    description: 'Entdecken Sie die vielfältigen Möglichkeiten des Nostr-Protokolls.',
  });

  const features = [
    {
      icon: MessageSquare,
      title: "Social Media",
      description: "Veröffentlichen Sie Notizen, Artikel und Inhalte ohne Zensur. Ihre Beiträge gehören Ihnen für immer.",
      color: "text-blue-600"
    },
    {
      icon: Calendar,
      title: "Kalender & Events",
      description: "Erstellen und teilen Sie Events und Termine. Koordinieren Sie Treffen dezentral mit der Community.",
      color: "text-purple-600"
    },
    {
      icon: MessageSquare,
      title: "Direktnachrichten",
      description: "Verschlüsselte private Nachrichten. Kommunizieren Sie sicher ohne Drittanbieter.",
      color: "text-green-600"
    },
    {
      icon: Wallet,
      title: "Lightning-Zahlungen",
      description: "Senden und empfangen Sie Bitcoin-Micropayments. Unterstützen Sie Creators direkt mit Zaps.",
      color: "text-yellow-600"
    },
    {
      icon: Users,
      title: "Communities",
      description: "Treten Sie Interessengruppen bei oder erstellen Sie eigene. Dezentrale Moderation möglich.",
      color: "text-indigo-600"
    },
    {
      icon: FileText,
      title: "Kanban-Boards",
      description: "Projektmanagement und Aufgabenverwaltung. Kollaborieren Sie transparent und offen.",
      color: "text-orange-600"
    },
    {
      icon: Globe,
      title: "Marktplatz",
      description: "Handeln Sie Waren und Dienstleistungen peer-to-peer. Keine Plattformgebühren.",
      color: "text-red-600"
    },
    {
      icon: FileText,
      title: "Long-Form Content",
      description: "Veröffentlichen Sie Artikel, Blogs und Dokumentation. Vollständige Formatierung unterstützt.",
      color: "text-teal-600"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="rounded-full"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Theme wechseln</span>
        </Button>
      </div>

      <div className="container mx-auto px-4 py-20">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-6 mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
            Unbegrenzte{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Möglichkeiten
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Nostr ist mehr als nur ein Social Network. Es ist ein offenes Protokoll, 
            das unzählige Anwendungen ermöglicht.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <feature.icon className={`h-10 w-10 mb-2 ${feature.color}`} />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription className="text-sm">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="max-w-3xl mx-auto">
          <Card className="border-2 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
            <CardHeader className="text-center space-y-4">
              <CardTitle className="text-2xl lg:text-3xl">
                Bereit, Teil der Bewegung zu werden?
              </CardTitle>
              <CardDescription className="text-base">
                Wählen Sie aus, wie Sie Nostr nutzen möchten.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center pb-8">
              <Button asChild size="lg" className="text-lg h-14 px-8">
                <Link to="/user-type">
                  Weiter zur Anmeldung
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg h-14 px-8">
                <Link to="/">Zurück</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Info Box */}
        <div className="max-w-3xl mx-auto mt-12">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground text-center">
                <strong>Hinweis:</strong> Alle diese Features basieren auf dem gleichen Protokoll. 
                Mit einem Nostr-Schlüsselpaar können Sie auf all diese Anwendungen zugreifen.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>
            Ein Tool von{" "}
            <a 
              href="https://edufeed.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              edufeed.org
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

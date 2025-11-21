import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/hooks/useTheme";
import { Moon, Sun, ArrowRight, Network, Shield, Users, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useSeoMeta } from '@unhead/react';

export default function WelcomePage() {
  const { theme, setTheme } = useTheme();

  useSeoMeta({
    title: 'Willkommen beim edufeed Nostr Onboarding',
    description: 'Entdecken Sie die dezentrale Zukunft edufeeds mit Nostr.',
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Theme Toggle - Fixed Position */}
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

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight">
            Willkommen bei{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              edufeed
            </span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Die dezentrale, zensurresistente und offene Zukunft sozialer Netzwerke. 
            Besitzen Sie Ihre Daten. Kontrollieren Sie Ihre Identität.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg" className="text-lg h-14 px-8">
              <Link to="/features">
                Jetzt starten
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg h-14 px-8">
              <Link to="/features">Mehr erfahren</Link>
            </Button>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20 max-w-6xl mx-auto">
          <Card className="border-2">
            <CardHeader>
              <Network className="h-10 w-10 mb-2 text-purple-600" />
              <CardTitle>Dezentral</CardTitle>
              <CardDescription>
                Keine zentrale Kontrolle. Ihre Daten gehören Ihnen.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <Shield className="h-10 w-10 mb-2 text-blue-600" />
              <CardTitle>Zensurresistent</CardTitle>
              <CardDescription>
                Niemand kann Sie zum Schweigen bringen oder sperren.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <Users className="h-10 w-10 mb-2 text-indigo-600" />
              <CardTitle>Interoperabel</CardTitle>
              <CardDescription>
                Eine Identität für alle Nostr-Anwendungen weltweit.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <Zap className="h-10 w-10 mb-2 text-violet-600" />
              <CardTitle>Lightning-Integration</CardTitle>
              <CardDescription>
                Senden und empfangen Sie Bitcoin-Micropayments direkt.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Additional Info Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Was ist Nostr?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Nostr (Notes and Other Stuff Transmitted by Relays) ist ein offenes Protokoll für 
                dezentrale soziale Netzwerke. Im Gegensatz zu traditionellen Plattformen wie Twitter 
                oder Facebook gibt es keine zentrale Firma, die Ihre Daten kontrolliert.
              </p>
              <p>
                Mit Nostr erstellen Sie ein Schlüsselpaar - Ihr privater Schlüssel ist Ihr Passwort 
                und Ihr öffentlicher Schlüssel ist Ihre Identität. Diese Identität gehört für immer 
                Ihnen, unabhängig davon, welche Anwendungen Sie nutzen.
              </p>
              <p className="font-medium text-foreground">
                Bereit, die Kontrolle über Ihre digitale Identität zu übernehmen?
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

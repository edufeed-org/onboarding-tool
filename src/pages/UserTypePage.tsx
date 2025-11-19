import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/hooks/useTheme";
import { Moon, Sun, User, Building2, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSeoMeta } from '@unhead/react';
import { useState } from "react";

export default function UserTypePage() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  useSeoMeta({
    title: 'Nutzertyp wählen - Nostr Onboarding',
    description: 'Wählen Sie aus, wie Sie Nostr nutzen möchten.',
  });

  const handleContinue = () => {
    if (selectedType) {
      navigate(`/register?type=${selectedType}`);
    }
  };

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
            Wer sind{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Sie?
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Wählen Sie aus, wie Sie Nostr nutzen möchten. 
            Dies hilft uns, Ihnen die besten Informationen zu zeigen.
          </p>
        </div>

        {/* User Type Selection */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {/* Regular User Card */}
          <Card 
            className={`border-2 cursor-pointer transition-all hover:shadow-lg ${
              selectedType === 'user' 
                ? 'ring-2 ring-purple-600 border-purple-600' 
                : 'hover:border-purple-300'
            }`}
            onClick={() => setSelectedType('user')}
          >
            <CardHeader className="text-center space-y-4 pb-4">
              <div className="mx-auto bg-purple-100 dark:bg-purple-900/30 p-4 rounded-full w-fit">
                <User className="h-12 w-12 text-purple-600" />
              </div>
              <CardTitle className="text-2xl">Nutzende</CardTitle>
              <CardDescription className="text-base">
                Ich möchte Nostr als soziales Netzwerk nutzen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Beiträge veröffentlichen und lesen</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Mit anderen Nutzern interagieren</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Events und Kalender nutzen</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Communities beitreten</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Lightning-Zahlungen senden/empfangen</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Platform Operator Card */}
          <Card 
            className={`border-2 cursor-pointer transition-all hover:shadow-lg ${
              selectedType === 'operator' 
                ? 'ring-2 ring-blue-600 border-blue-600' 
                : 'hover:border-blue-300'
            }`}
            onClick={() => setSelectedType('operator')}
          >
            <CardHeader className="text-center space-y-4 pb-4">
              <div className="mx-auto bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full w-fit">
                <Building2 className="h-12 w-12 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Plattformbetreibende</CardTitle>
              <CardDescription className="text-base">
                Ich möchte Nostr in meine Plattform integrieren
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Nostr-Protokoll verstehen und integrieren</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Relay-Server betreiben</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Kanban-Boards und Tools nutzen</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Technische Dokumentation erhalten</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Metadaten-Management verstehen</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Continue Button */}
        <div className="max-w-md mx-auto space-y-4">
          <Button 
            size="lg" 
            className="w-full text-lg h-14"
            onClick={handleContinue}
            disabled={!selectedType}
          >
            Weiter zur Registrierung
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button 
            asChild
            variant="outline" 
            size="lg" 
            className="w-full text-lg h-14"
          >
            <Link to="/features">Zurück</Link>
          </Button>
        </div>

        {/* Info Box */}
        <div className="max-w-2xl mx-auto mt-12">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground text-center">
                <strong>Hinweis:</strong> Diese Auswahl ist nur für die Onboarding-Erfahrung. 
                Mit einem Nostr-Schlüsselpaar können Sie später alle Funktionen nutzen.
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

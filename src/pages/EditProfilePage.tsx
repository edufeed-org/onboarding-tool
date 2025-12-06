import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EditProfileForm } from "@/components/EditProfileForm";
import { useTheme } from "@/hooks/useTheme";
import { Moon, Sun, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useSeoMeta } from '@unhead/react';

export default function EditProfilePage() {
  const { theme, setTheme } = useTheme();

  useSeoMeta({
    title: 'Profil bearbeiten - Nostr Onboarding',
    description: 'Bearbeiten Sie Ihr Nostr-Profil.',
  });

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
        {/* Back Button */}
        <div className="max-w-3xl mx-auto mb-6">
          <Link to="/user-dashboard">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Zurück zum Dashboard
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Profil bearbeiten
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Vervollständigen Sie Ihr Profil, damit andere Sie finden können.
          </p>
        </div>

        {/* Profile Form */}
        <div className="max-w-3xl mx-auto">
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Profil-Informationen</CardTitle>
              <CardDescription>
                Fügen Sie Informationen zu Ihrem Profil hinzu. Diese werden auf Nostr veröffentlicht und sind öffentlich sichtbar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EditProfileForm />
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <div className="max-w-3xl mx-auto mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">💡 Tipps für Ihr Profil</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2 text-lg">📸</span>
                  <span>
                    <strong>Profilbild:</strong> Ein erkennbares Profilbild hilft anderen, Sie zu identifizieren und macht Ihr Profil persönlicher.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-lg">✍️</span>
                  <span>
                    <strong>Name:</strong> Verwenden Sie Ihren echten Namen oder einen Nickname, unter dem Sie bekannt sein möchten.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-lg">📝</span>
                  <span>
                    <strong>Bio:</strong> Eine kurze Beschreibung hilft anderen zu verstehen, wer Sie sind und was Sie interessiert.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-lg">✅</span>
                  <span>
                    <strong>NIP-05:</strong> Eine verifizierte Nostr-Adresse (wie eine E-Mail) macht Ihr Profil vertrauenswürdiger.
                  </span>
                </li>
              </ul>
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

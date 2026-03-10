import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EditProfileForm } from "@/components/EditProfileForm";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useSeoMeta } from '@unhead/react';
import { PageHeader } from "@/components/PageHeader";

export default function EditProfilePage() {
  useSeoMeta({
    title: 'Profil bearbeiten - Nostr Onboarding',
    description: 'Bearbeiten Sie Ihr Nostr-Profil.',
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-20">
        <PageHeader />

        {/* Back Button */}
        <div className="max-w-3xl mx-auto mb-6">
          <Link to="/user-dashboard">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Zurück zum Dashboard
            </Button>
          </Link>
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
                    <strong>Handle:</strong> Eine verifizierbare Adresse macht Ihr Profil vertrauenswürdiger.
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

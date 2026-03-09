import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Network, Shield, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useSeoMeta } from '@unhead/react';
import { PageHeader } from "@/components/PageHeader";

export default function WelcomePage() {
  useSeoMeta({
    title: 'Willkommen beim edufeed Nostr Onboarding',
    description: 'Entdecken Sie die dezentrale Zukunft edufeeds mit Nostr.',
  });

  return (
    <div className="min-h-screen bg-background">
      <PageHeader />

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
            EduFeed verbindet Bildungsinhalte aus verschiedenen Plattformen in einem gemeinsamen, offenen Feed.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mt-20 max-w-6xl mx-auto">
          <Card className="border-2">
            <CardHeader>
              <Network className="h-10 w-10 mb-2 text-purple-600" />
              <CardTitle>Offener Bildungsfeed</CardTitle>
              <CardDescription>
                Inhalte aus verschiedenen Plattformen werden in einem gemeinsamen Feed sichtbar.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <Shield className="h-10 w-10 mb-2 text-blue-600" />
              <CardTitle>Plattformübergreifende Inhalte</CardTitle>
              <CardDescription>
                Beiträge können unabhängig von einzelnen Plattformen gefunden und genutzt werden.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <Users className="h-10 w-10 mb-2 text-indigo-600" />
              <CardTitle>Vernetzung und Austausch</CardTitle>
              <CardDescription>
                Communities können Inhalte teilen, diskutieren und gemeinsam weiterentwickeln.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-14">
            <Button asChild size="lg" className="text-lg h-14 px-8">
              <Link to="/warum-edufeed">
                Weiter
              </Link>
            </Button>
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

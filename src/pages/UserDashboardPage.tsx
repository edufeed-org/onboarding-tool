import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/hooks/useTheme";
import { Moon, Sun, User, MessageSquare, Calendar, Wallet, Heart, Users, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useSeoMeta } from '@unhead/react';
import { EditProfileForm } from "@/components/EditProfileForm";
import { useState } from "react";

export default function UserDashboardPage() {
  const { theme, setTheme } = useTheme();
  const [showProfileForm, setShowProfileForm] = useState(false);

  useSeoMeta({
    title: 'Dashboard - Nostr Onboarding',
    description: 'Ihr persönliches Nostr Dashboard.',
  });

  const quickActions = [
    {
      icon: User,
      title: "Profil bearbeiten",
      description: "Vervollständigen Sie Ihr Profil",
      color: "text-purple-600",
      action: () => setShowProfileForm(!showProfileForm)
    },
    {
      icon: MessageSquare,
      title: "Erste Nachricht",
      description: "Teilen Sie Ihre ersten Gedanken",
      color: "text-blue-600",
      href: "/"
    },
    {
      icon: Users,
      title: "Nutzer folgen",
      description: "Finden Sie interessante Personen",
      color: "text-green-600",
      href: "/"
    },
    {
      icon: Calendar,
      title: "Events entdecken",
      description: "Finden Sie lokale Events",
      color: "text-orange-600",
      href: "/"
    }
  ];

  const features = [
    {
      icon: MessageSquare,
      title: "Nachrichten posten",
      description: "Teilen Sie Ihre Gedanken, Ideen und Erlebnisse mit der Community. Ihre Inhalte gehören für immer Ihnen."
    },
    {
      icon: Heart,
      title: "Mit anderen interagieren",
      description: "Liken, kommentieren und teilen Sie Beiträge. Bauen Sie echte Verbindungen auf."
    },
    {
      icon: Calendar,
      title: "Events & Kalender",
      description: "Entdecken Sie Events in Ihrer Nähe oder erstellen Sie eigene. Koordinieren Sie Treffen dezentral."
    },
    {
      icon: Wallet,
      title: "Lightning-Zahlungen",
      description: "Senden und empfangen Sie Bitcoin-Micropayments. Unterstützen Sie Creators direkt mit Zaps."
    },
    {
      icon: Users,
      title: "Communities beitreten",
      description: "Finden Sie Gleichgesinnte und treten Sie themenspezifischen Communities bei."
    },
    {
      icon: TrendingUp,
      title: "Ihre Reichweite erhöhen",
      description: "Je aktiver Sie sind, desto mehr Menschen werden Sie entdecken. Bauen Sie Ihre Präsenz auf."
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
            Sie haben erfolgreich Ihr Nostr-Schlüsselpaar erstellt. 
            Jetzt können Sie die dezentrale Welt erkunden!
          </p>
        </div>

        {/* Profile Form Section */}
        {showProfileForm && (
          <div className="max-w-3xl mx-auto mb-12">
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Profil vervollständigen</CardTitle>
                <CardDescription>
                  Fügen Sie Informationen zu Ihrem Profil hinzu, damit andere Sie finden können.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EditProfileForm />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <div className="max-w-5xl mx-auto mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Erste Schritte</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              action.action ? (
                <Card
                  key={index}
                  className="border-2 hover:shadow-lg transition-all cursor-pointer hover:border-primary"
                  onClick={action.action}
                >
                  <CardHeader className="text-center">
                    <action.icon className={`h-10 w-10 mx-auto mb-2 ${action.color}`} />
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {action.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ) : (
                <Link key={index} to={action.href || "/"}>
                  <Card className="border-2 hover:shadow-lg transition-all hover:border-primary h-full">
                    <CardHeader className="text-center">
                      <action.icon className={`h-10 w-10 mx-auto mb-2 ${action.color}`} />
                      <CardTitle className="text-lg">{action.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {action.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              )
            ))}
          </div>
        </div>

        {/* Welcome Card */}
        <div className="max-w-3xl mx-auto mb-12">
          <Card className="border-2 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
            <CardHeader>
              <CardTitle className="text-2xl">Was Sie jetzt tun können</CardTitle>
              <CardDescription className="text-base">
                Ihr Nostr-Abenteuer beginnt hier. Dies sind die ersten Schritte, um Teil der Community zu werden.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Profil vervollständigen</h3>
                    <p className="text-sm text-muted-foreground">
                      Fügen Sie ein Profilbild, einen Namen und eine Beschreibung hinzu. 
                      Das hilft anderen, Sie zu finden und kennenzulernen.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Erste Nachricht posten</h3>
                    <p className="text-sm text-muted-foreground">
                      Stellen Sie sich der Community vor! Teilen Sie, wer Sie sind und was Sie interessiert.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Anderen Nutzern folgen</h3>
                    <p className="text-sm text-muted-foreground">
                      Finden Sie interessante Menschen und folgen Sie ihnen. Ihr Feed wird mit deren Inhalten gefüllt.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Verschiedene Clients ausprobieren</h3>
                    <p className="text-sm text-muted-foreground">
                      Ihr Schlüsselpaar funktioniert überall! Probieren Sie Damus, Amethyst, Snort oder andere Clients aus.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Overview */}
        <div className="max-w-5xl mx-auto mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Was Sie auf Nostr machen können</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-2">
                <CardHeader>
                  <feature.icon className="h-10 w-10 mb-2 text-purple-600" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Tips Section */}
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">💡 Tipps für den Start</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2 text-lg">🔐</span>
                  <span>
                    <strong>Sicherheit:</strong> Installieren Sie eine Browser-Extension wie "nos2x" 
                    oder "Alby" für sicherere Logins bei verschiedenen Clients.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-lg">🌐</span>
                  <span>
                    <strong>Relays:</strong> Sie können in den Einstellungen verschiedene Relays 
                    hinzufügen oder entfernen, um mehr oder weniger Inhalte zu sehen.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-lg">⚡</span>
                  <span>
                    <strong>Lightning:</strong> Um Zaps zu senden/empfangen, richten Sie eine 
                    Lightning-Wallet wie Alby oder Wallet of Satoshi ein.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-lg">🤝</span>
                  <span>
                    <strong>Community:</strong> Die Nostr-Community ist hilfsbereit! 
                    Stellen Sie Fragen mit dem #asknostr Hashtag.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-lg">🆓</span>
                  <span>
                    <strong>Freiheit:</strong> Sie besitzen Ihre Identität. Niemand kann Sie 
                    sperren oder Ihre Inhalte löschen. Mit großer Freiheit kommt große Verantwortung.
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

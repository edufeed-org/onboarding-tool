import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Server, Boxes, BookOpen, GitBranch, Webhook, ExternalLink } from "lucide-react";
import { useSeoMeta } from '@unhead/react';
import { PageHeader } from "@/components/PageHeader";

export default function PlatformDashboardPage() {
  useSeoMeta({
    title: 'Plattform-Dashboard - Nostr Onboarding',
    description: 'Technische Ressourcen für Plattformbetreibende.',
  });

  const resources = [
    {
      icon: BookOpen,
      title: "NIPs (Nostr Implementation Possibilities)",
      description: "Die offiziellen Nostr-Protokoll-Spezifikationen",
      link: "https://github.com/nostr-protocol/nips",
      color: "text-blue-600"
    },
    {
      icon: Code,
      title: "Nostrify SDK",
      description: "TypeScript/JavaScript SDK für Nostr-Integration",
      link: "https://nostrify.dev",
      color: "text-purple-600"
    },
    {
      icon: Server,
      title: "Relay-Implementierungen",
      description: "Verschiedene Relay-Server zum Selbst-Hosten",
      link: "https://github.com/nostr-protocol/nostr#relays",
      color: "text-green-600"
    },
    {
      icon: Webhook,
      title: "nostr-tools",
      description: "JavaScript-Bibliothek für Nostr-Entwicklung",
      link: "https://github.com/nbd-wtf/nostr-tools",
      color: "text-orange-600"
    }
  ];

  const integrationTopics = [
    {
      title: "Event-Arten verstehen",
      description: "Nostr verwendet verschiedene Event-Kinds für unterschiedliche Inhaltstypen",
      details: [
        "Kind 0: Metadaten (Profil)",
        "Kind 1: Text-Notizen (Posts)",
        "Kind 3: Kontaktlisten (Following)",
        "Kind 4: Verschlüsselte Direktnachrichten",
        "Kind 7: Reactions (Likes)",
        "Kind 30023: Long-form Content (Artikel)",
        "Kind 31922/31923: Kalender-Events"
      ]
    },
    {
      title: "Relay-Architektur",
      description: "Relays sind einfache WebSocket-Server, die Events speichern und weiterleiten",
      details: [
        "Client sendet Events via WebSocket",
        "Relay validiert und speichert Events",
        "Clients abonnieren Events via Filter",
        "Relay sendet passende Events zurück",
        "Jeder kann einen Relay betreiben"
      ]
    },
    {
      title: "Kanban-Board Integration",
      description: "Projektmanagement auf Nostr kann mit benutzerdefinierten Event-Kinds realisiert werden",
      details: [
        "Verwenden Sie addressable Events (Kind 30000-39999)",
        "Boards als addressable Events mit 'd'-Tag",
        "Tasks als referenzierte Events",
        "Kollaboration über geteilte Relays",
        "Verschlüsselung für private Boards möglich"
      ]
    },
    {
      title: "Metadaten & Tagging",
      description: "Strukturierte Daten durch Tags und Event-Referenzen",
      details: [
        "'e' Tags für Event-Referenzen",
        "'p' Tags für Pubkey-Referenzen",
        "'d' Tag für addressable Events",
        "'t' Tags für Hashtags/Kategorien",
        "Benutzerdefinierte Tags für spezifische Anwendungen"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <PageHeader />

      <div className="container mx-auto px-4 py-20">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center space-y-6 mb-12">
          <Boxes className="h-16 w-16 mx-auto text-blue-600" />
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
            Plattform-
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Dashboard
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Technische Ressourcen und Anleitungen für die Integration des Nostr-Protokolls 
            in Ihre Plattform.
          </p>
        </div>

        {/* Quick Links */}
        <div className="max-w-5xl mx-auto mb-12">
          <h2 className="text-2xl font-bold mb-6">Wichtige Ressourcen</h2>
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
                        <resource.icon className={`h-8 w-8 ${resource.color}`} />
                        <div>
                          <CardTitle className="text-lg">{resource.title}</CardTitle>
                          <CardDescription className="text-sm mt-1">
                            {resource.description}
                          </CardDescription>
                        </div>
                      </div>
                      <ExternalLink className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardHeader>
                </Card>
              </a>
            ))}
          </div>
        </div>

        {/* Integration Topics */}
        <div className="max-w-5xl mx-auto mb-12">
          <h2 className="text-2xl font-bold mb-6">Integration-Themen</h2>
          <div className="space-y-6">
            {integrationTopics.map((topic, index) => (
              <Card key={index} className="border-2">
                <CardHeader>
                  <CardTitle className="text-xl">{topic.title}</CardTitle>
                  <CardDescription>{topic.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {topic.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start text-sm">
                        <GitBranch className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Implementation Guide */}
        <div className="max-w-5xl mx-auto mb-12">
          <Card className="border-2 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
            <CardHeader>
              <CardTitle className="text-2xl">Erste Schritte zur Integration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Protokoll verstehen</h3>
                    <p className="text-sm text-muted-foreground">
                      Lesen Sie die NIPs (Nostr Implementation Possibilities), insbesondere NIP-01 für die Grundlagen.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">SDK wählen</h3>
                    <p className="text-sm text-muted-foreground">
                      Verwenden Sie Nostrify (TypeScript) oder nostr-tools für einfache Integration.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Relay auswählen</h3>
                    <p className="text-sm text-muted-foreground">
                      Verbinden Sie sich mit öffentlichen Relays oder hosten Sie Ihren eigenen.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Events implementieren</h3>
                    <p className="text-sm text-muted-foreground">
                      Erstellen und verarbeiten Sie Events nach Ihren Anforderungen.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                    5
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Testen & Optimieren</h3>
                    <p className="text-sm text-muted-foreground">
                      Testen Sie mit verschiedenen Clients und optimieren Sie die Performance.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Code Example */}
        <div className="max-w-5xl mx-auto mb-12">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-xl">Beispiel: Event veröffentlichen</CardTitle>
              <CardDescription>Einfaches Beispiel mit nostr-tools</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`import { SimplePool, finalizeEvent } from 'nostr-tools';

// Relay-Pool erstellen
const pool = new SimplePool();
const relays = ['wss://relay.damus.io', 'wss://relay.nostr.band'];

// Event erstellen
const event = finalizeEvent({
  kind: 1, // Text-Notiz
  created_at: Math.floor(Date.now() / 1000),
  tags: [],
  content: 'Hallo Nostr!'
}, privateKey);

// Event veröffentlichen
await Promise.all(pool.publish(relays, event));

// Events abfragen
const events = await pool.querySync(relays, {
  kinds: [1],
  limit: 10
});`}</code>
              </pre>
            </CardContent>
          </Card>
        </div>

        {/* Support Section */}
        <div className="max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Benötigen Sie Unterstützung?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Die Nostr-Community ist sehr aktiv und hilfsbereit. Hier finden Sie weitere Hilfe:
              </p>
              <div className="space-y-2">
                <a
                  href="https://github.com/nostr-protocol/nostr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm hover:underline text-blue-600"
                >
                  <ExternalLink className="h-4 w-4" />
                  GitHub: nostr-protocol/nostr
                </a>
                <a
                  href="https://nostr.how"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm hover:underline text-blue-600"
                >
                  <ExternalLink className="h-4 w-4" />
                  nostr.how - Anleitungen und Tutorials
                </a>
                <a
                  href="https://github.com/aljazceru/awesome-nostr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm hover:underline text-blue-600"
                >
                  <ExternalLink className="h-4 w-4" />
                  Awesome Nostr - Kuratierte Liste von Ressourcen
                </a>
              </div>
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

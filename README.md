# Nostr Onboarding Tool

**Die umfassende Plattform für den Einstieg in das Nostr-Netzwerk**

Das Nostr Onboarding Tool ist eine benutzerfreundliche Webanwendung, die neuen Nutzern und Plattformbetreibenden den Einstieg in das dezentrale Nostr-Protokoll erleichtert. Mit interaktiven Anleitungen, automatischer Schlüsselverwaltung und umfassenden Ressourcen macht diese Anwendung den Start ins Nostr-Ökosystem so einfach wie möglich.

## 🎯 Vision

Nostr ist die Zukunft der dezentralen Kommunikation – ein offenes Protokoll ohne zentrale Kontrolle, Zensur oder Datenkraken. Doch für viele Neueinsteiger ist das Konzept kryptographischer Schlüssel, dezentraler Relays und Event-basierter Architektur überwältigend.

**Unsere Vision**: Jeder Mensch sollte Zugang zu zensurresistenten, dezentralen sozialen Netzwerken haben – ohne technische Barrieren.

Das Nostr Onboarding Tool:
- **Vereinfacht** den Einstieg durch geführte Registrierung und Schlüsselverwaltung
- **Erklärt** die Konzepte und Möglichkeiten des Nostr-Protokolls verständlich
- **Befähigt** sowohl Endnutzer als auch Entwickler, das Nostr-Ökosystem zu nutzen und zu erweitern
- **Demokratisiert** den Zugang zu dezentraler Technologie

### Für wen ist dieses Tool?

**Endnutzer**:
- Erste Schritte mit Nostr ohne technische Vorkenntnisse
- Sichere Schlüsselverwaltung und Account-Erstellung
- Einführung in Social Media, Messaging, Lightning-Zahlungen und Communities

**Plattformbetreibende & Entwickler**:
- Technische Ressourcen und Dokumentation zu NIPs (Nostr Implementation Possibilities)
- Integration von Nostr in bestehende Plattformen
- Beispiele für Kanban-Boards, Kalender, Marktplätze und mehr

## ✨ Features

### 🚀 Geführtes Onboarding

- **Interaktiver Willkommensbildschirm**: Ansprechende Einführung in Nostr mit animierten Gradient-Überschriften und klaren Kernbotschaften
- **Nutzertyp-Auswahl**: Personalisierte Pfade für Endnutzer und Plattformbetreibende mit visuellen Kartendesigns
- **Sichere Schlüsselerstellung**: Automatische Generierung von nsec/npub-Schlüsselpaaren mit Sicherheitshinweisen
- **Schlüssel-Download**: Exportfunktion für sicheres Offline-Backup der Schlüssel
- **Automatischer Login**: Nahtlose Integration nach der Registrierung

### 🎨 Benutzerfreundliches Interface

- **Dark/Light Mode**: Vollständige Theme-Unterstützung mit eleganten Farbübergängen
- **Responsive Design**: Optimiert für Desktop, Tablet und Mobile
- **Moderne UI-Komponenten**: 48+ shadcn/ui Komponenten mit Radix UI
- **Intuitive Navigation**: React Router mit ScrollToTop-Funktionalität
- **Barrierefreiheit**: WCAG 2.1 AA-konforme Implementierung

### 📚 Umfassende Dokumentation

- **Feature-Übersicht**: Detaillierte Erklärungen zu Social Media, Kalender, Direktnachrichten, Lightning-Zahlungen, Communities und mehr
- **Technische Ressourcen**: Links zu NIPs, SDKs, Relay-Implementierungen und Entwickler-Tools
- **Best Practices**: Anleitungen zu Event-Arten, Relay-Architektur, Tagging und Metadaten

### 👤 User Dashboard

Nach erfolgreicher Registrierung erhalten Nutzer Zugang zu:
- **Profilverwaltung**: Bearbeitung des Nostr-Profils mit EditProfileForm
- **Quick Actions**: Erste Nachricht posten, Nutzern folgen, Events entdecken
- **Feature-Katalog**: Übersicht über Messaging, Reactions, Kalender, Lightning, Communities
- **Lernressourcen**: Schritt-für-Schritt-Anleitungen für typische Anwendungsfälle

### 🏢 Plattform-Dashboard

Entwickler und Betreiber erhalten:
- **NIP-Referenzen**: Direkte Links zur offiziellen Nostr-Protokoll-Dokumentation
- **SDK-Integration**: Nostrify, nostr-tools und weitere JavaScript/TypeScript-Bibliotheken
- **Relay-Guides**: Informationen zum Betrieb eigener Relay-Server
- **Integration-Beispiele**: Konkrete Implementierungen für Kanban-Boards, Event-Systeme, Metadaten-Strukturen
- **Event-Arten erklärt**: Übersicht über Kind 0-31923 mit Anwendungsfällen

### 🔐 Sicherheit & Datenschutz

- **Client-seitige Schlüsselerzeugung**: Private Keys verlassen niemals den Browser während der Erstellung
- **NIP-07 Browser Signing**: Unterstützung für Browser-Extensions wie Alby, nos2x
- **NIP-44 Verschlüsselung**: Moderne Verschlüsselung für Direktnachrichten

### 💬 Kommunikationsfeatures

- **NIP-04 Direktnachrichten**: Legacy-Verschlüsselung für maximale Kompatibilität
- **NIP-17 Private Messaging**: Moderne, verbesserte Privatsphäre-Implementierung
- **Kommentarsystem (NIP-22)**: Threaded Comments mit `CommentsSection`-Komponente
- **AI-Chat-Integration**: Shakespeare API für KI-gestützte Konversationen

### ⚡ Lightning-Integration

- **WebLN-Unterstützung**: Browser-Wallet-Integration über Alby
- **Nostr Wallet Connect (NIP-47)**: Remote-Wallet-Verbindung
- **Zaps (NIP-57)**: Mikrozahlungen direkt an Content-Ersteller
- **Wallet-Modal**: Benutzerfreundliche Zahlungsinterfaces

## 🛠️ Tech Stack

### Frontend-Framework
- **React 18.x**: Moderne React-Version mit Hooks, Concurrent Rendering und Suspense
- **TypeScript**: Typ-sichere Entwicklung für bessere Code-Qualität
- **Vite**: Schneller Build-Prozess und Hot Module Replacement

### Styling & UI
- **TailwindCSS 3.x**: Utility-First CSS-Framework
- **shadcn/ui**: 48+ zugängliche UI-Komponenten basierend auf Radix UI
- **Radix UI**: Primitive UI-Komponenten für Accessibility
- **class-variance-authority**: Type-safe Varianten-Management
- **Lucide Icons**: Umfangreiche Icon-Bibliothek

### Nostr-Integration
- **Nostrify**: Nostr-Protocol-Framework für Web (v0.47.1)
- **@nostrify/react**: React-Hooks für Nostr (v0.2.17)
- **nostr-tools**: Kryptographie, NIP-19-Dekodierung, Event-Validierung

### State Management & Data Fetching
- **TanStack Query (React Query)**: Server-State-Management, Caching, Infinite Scroll
- **React Context API**: Globaler State für AppContext, DMContext, NWCContext
- **LocalStorage Hooks**: Persistenter State für Einstellungen und Relay-Konfiguration

### Routing & SEO
- **React Router v6**: Deklaratives Client-Side-Routing
- **@unhead/react**: SEO-Meta-Tags und Head-Management
- **ScrollToTop**: Automatisches Scrollen bei Route-Wechsel

### Formulare & Validierung
- **React Hook Form**: Performante Formular-Verwaltung
- **Zod**: Schema-Validierung mit TypeScript-Integration
- **@hookform/resolvers**: Zod-Integration für React Hook Form

### Lightning & Wallet
- **@getalby/sdk**: Alby SDK für Lightning-Zahlungen
- **WebLN**: Browser-Wallet-Standard
- **NWC (Nostr Wallet Connect)**: Remote-Wallet-Verbindungen

### Testing
- **Vitest**: Schnelle Unit-Tests mit jsdom-Umgebung
- **React Testing Library**: Component-Tests mit Accessibility-Focus
- **@testing-library/jest-dom**: Custom Matchers für DOM-Tests

### Entwickler-Tools
- **ESLint**: Code-Linting mit Custom Rules
- **PostCSS**: CSS-Transformationen mit Autoprefixer
- **TypeScript Compiler**: Typ-Checking vor dem Build

### Deployment
- **NostrDeploy CLI**: One-Command-Deployment auf NostrDeploy.com
- **Vercel/Netlify**: Alternative Hosting-Plattformen mit `_redirects`-Konfiguration
- **GitHub Pages**: Deployment auf GitHub Pages via GitHub Actions

## 📁 Projektstruktur

```
src/
├── pages/                      # Hauptseiten der Anwendung
│   ├── WelcomePage.tsx        # Einstiegsseite mit Hero-Section
│   ├── FeaturesPage.tsx       # Feature-Übersicht
│   ├── RegisterPage.tsx       # Schlüsselerstellung und Login
│   ├── UserDashboardPage.tsx  # Dashboard für Endnutzer
│   └── PlatformDashboardPage.tsx # Dashboard für Entwickler
│
├── components/                 # Wiederverwendbare Komponenten
│   ├── auth/                  # Authentifizierung
│   │   ├── LoginArea.tsx      # Login/Signup UI
│   │   ├── LoginDialog.tsx    # Login-Modal
│   │   ├── SignupDialog.tsx   # Registrierungs-Modal
│   │   └── AccountSwitcher.tsx # Account-Verwaltung
│   │
│   ├── dm/                    # Direct Messaging
│   │   ├── DMMessagingInterface.tsx
│   │   ├── DMConversationList.tsx
│   │   ├── DMChatArea.tsx
│   │   └── DMStatusInfo.tsx
│   │
│   ├── comments/              # Kommentarsystem (NIP-22)
│   │   ├── CommentsSection.tsx
│   │   ├── Comment.tsx
│   │   └── CommentForm.tsx
│   │
│   ├── ui/                    # shadcn/ui Komponenten (48+)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   └── ... (weitere 44+ Komponenten)
│   │
│   ├── AppProvider.tsx        # App-weiter State-Provider
│   ├── NostrProvider.tsx      # Nostr-Client-Provider
│   ├── DMProvider.tsx         # Direct-Messaging-Provider
│   ├── EditProfileForm.tsx    # Profilbearbeitung
│   ├── RelayListManager.tsx   # NIP-65 Relay-Verwaltung
│   ├── NostrSync.tsx          # Relay-Sync bei Login
│   ├── NoteContent.tsx        # Rich-Text-Rendering für Notes
│   ├── ZapButton.tsx          # Lightning-Zap-Button
│   ├── ZapDialog.tsx          # Zap-Zahlungs-Dialog
│   └── WalletModal.tsx        # Wallet-Auswahl-Modal
│
├── hooks/                     # Custom React Hooks
│   ├── useNostr.ts           # Nostr Query/Publish
│   ├── useAuthor.ts          # User-Profile abrufen
│   ├── useCurrentUser.ts     # Aktuell eingeloggter User
│   ├── useNostrPublish.ts    # Event-Publishing
│   ├── useUploadFile.ts      # Blossom-Server-Upload
│   ├── useZaps.ts            # Lightning-Zaps
│   ├── useWallet.ts          # Wallet-Detection (WebLN + NWC)
│   ├── useNWC.ts             # Nostr Wallet Connect
│   ├── useComments.ts        # Kommentare laden
│   ├── usePostComment.ts     # Kommentar erstellen
│   ├── useDMContext.ts       # Direct-Messaging-Context
│   ├── useConversationMessages.ts # Paginierte DM-Messages
│   ├── useShakespeare.ts     # AI-Chat-Integration
│   ├── useTheme.ts           # Theme-Verwaltung
│   ├── useToast.ts           # Toast-Benachrichtigungen
│   ├── useLocalStorage.ts    # Persistenter State
│   ├── useLoggedInAccounts.ts # Multi-Account-Management
│   ├── useLoginActions.ts    # Login/Logout-Actions
│   └── useIsMobile.tsx       # Responsive-Helper
│
├── contexts/                  # React Context Definitions
│   ├── AppContext.ts         # App-Konfiguration & Theme
│   ├── DMContext.ts          # Direct-Messaging-State
│   └── NWCContext.tsx        # Nostr-Wallet-Connect-State
│
├── lib/                       # Utility-Funktionen
│   ├── utils.ts              # Allgemeine Hilfsfunktionen
│   ├── genUserName.ts        # Nutzer-Display-Names generieren
│   ├── dmConstants.ts        # DM-Protokoll-Konstanten
│   ├── dmMessageStore.ts     # Lokaler DM-Speicher
│   └── dmUtils.ts            # DM-Helper-Funktionen
│
├── test/                      # Testing-Setup
│   ├── TestApp.tsx           # Test-Wrapper mit Providern
│   ├── setup.ts              # Vitest-Konfiguration
│   └── ErrorBoundary.test.tsx # Beispiel-Tests
│
├── App.tsx                    # Haupt-App-Komponente mit Providern
├── AppRouter.tsx             # React Router-Konfiguration
├── main.tsx                  # App-Entry-Point
└── index.css                 # Globale Styles & Theme-Variablen

docs/                          # Erweiterte Dokumentation
├── AI_CHAT.md                # Shakespeare API-Integration
├── NOSTR_COMMENTS.md         # Kommentarsystem-Implementierung
├── NOSTR_DIRECT_MESSAGES.md  # DM-System (NIP-04 & NIP-17)
└── NOSTR_INFINITE_SCROLL.md  # Feed-Pagination

eslint-rules/                  # Custom ESLint-Regeln
├── no-inline-script.js       # Verhindert Inline-Scripts
├── no-placeholder-comments.js # Warnt bei Placeholder-Kommentaren
└── require-webmanifest.js    # Erzwingt Web-Manifest

public/                        # Statische Assets
├── manifest.webmanifest      # PWA-Manifest
├── robots.txt                # SEO-Konfiguration
└── _redirects                # Netlify/Vercel-Routing

AGENTS.md                      # Umfassende Dokumentation für AI-Agenten
```

## 🚀 Installation & Entwicklung

### Voraussetzungen

- Node.js 18+ und npm
- Grundkenntnisse in React (für Entwickler)

### Lokale Entwicklung starten

```bash
# Repository klonen
git clone https://github.com/edufeed-org/onboarding-tool.git
cd onboarding-tool

# Abhängigkeiten installieren und Dev-Server starten
npm run dev
```

Die Anwendung läuft nun unter `http://localhost:5173`

### Build für Produktion

```bash
# Optimierten Production-Build erstellen
npm run build

# Deployment auf NostrDeploy.com
npm run deploy
```

### Tests ausführen

```bash
# TypeScript-Prüfung, Linting und Tests
npm test
```

## 📚 Weiterführende Dokumentation

- **[AGENTS.md](./AGENTS.md)**: Vollständige technische Dokumentation für Entwickler und AI-Agenten
- **[docs/AI_CHAT.md](./docs/AI_CHAT.md)**: Integration von Shakespeare AI für Chat-Features
- **[docs/NOSTR_COMMENTS.md](./docs/NOSTR_COMMENTS.md)**: Kommentarsystem mit NIP-22
- **[docs/NOSTR_DIRECT_MESSAGES.md](./docs/NOSTR_DIRECT_MESSAGES.md)**: Verschlüsselte Direktnachrichten (NIP-04 & NIP-17)
- **[docs/NOSTR_INFINITE_SCROLL.md](./docs/NOSTR_INFINITE_SCROLL.md)**: Infinite-Scroll für Event-Feeds

### Externe Ressourcen

- **[Nostr Protocol](https://nostr.com)**: Offizielle Nostr-Website
- **[NIPs Repository](https://github.com/nostr-protocol/nips)**: Nostr Implementation Possibilities
- **[Nostrify Documentation](https://nostrify.dev)**: SDK-Dokumentation
- **[shadcn/ui](https://ui.shadcn.com)**: UI-Komponenten-Bibliothek

## 🎨 Design-Prinzipien

- **Benutzerfreundlichkeit über alles**: Komplexe Konzepte werden vereinfacht, ohne technische Genauigkeit zu verlieren
- **Vertrauen durch Transparenz**: Sicherheitshinweise und Erklärungen bei kritischen Aktionen
- **Responsive & Accessible**: Funktioniert auf allen Geräten und für alle Nutzer
- **Visuell ansprechend**: Moderne Gradients, Animationen und durchdachte Typografie

## 🤝 Contributing

Beiträge sind willkommen! Das Projekt ist Open Source und lebt von der Community.

### Richtlinien

- Folge den bestehenden TypeScript- und React-Patterns
- Keine `any`-Types – immer typsicher bleiben
- Schreibe Tests für neue Features
- Dokumentiere neue Hooks und Komponenten

## 📄 Lizenz

Open Source – helfen Sie mit, das dezentrale Web zu gestalten!

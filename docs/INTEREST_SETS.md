# Interest Sets Konfiguration

Interest Sets sind kuratierte Hashtag-Sammlungen, denen Nutzer folgen können, um schnell interessante Themen zu entdecken. Sie ermöglichen eine thematische Filterung von Inhalten.

## Übersicht

Interest Sets ermöglichen es:
- Administratoren, kuratierte Hashtag-Sammlungen zu erstellen und zu pflegen
- Nutzern, mit einem Klick mehreren Hashtags gleichzeitig zu folgen
- Communities, thematische Empfehlungen für neue Nutzer zu standardisieren

Es gibt zwei Arten von Interest Sets:
1. **Statisch** - Komplett im Code definiert mit fest hinterlegten Hashtags
2. **Pointer-basiert** - Verweist auf ein Nostr Event, das die Hashtags enthält (ermöglicht Remote-Updates)

## Wo werden Interest Sets konfiguriert?

### Hardcodierte Interest Sets (Standard)

Die angezeigten Interest Sets werden **hardcodiert** in der Datei konfiguriert:

**`src/hooks/useInterestSets.ts`**

```typescript
const INTEREST_SET_CONFIGS: InterestSetConfig[] = [
  {
    id: 'lernen-bildung',
    title: 'Lernen & Bildung',
    description: 'Kuratiert Inhalte rund um offene Bildung, Lerncommunities und moderne Didaktik.',
    hashtags: ['bildung', 'lernen', 'edtech', 'openlearning'],
  },
  // Weitere Interest Sets hier hinzufügen...
];
```

**Wie man ein neues Interest Set hinzufügt:**

1. Öffne `src/hooks/useInterestSets.ts`
2. Füge ein neues Objekt zum `INTEREST_SET_CONFIGS` Array hinzu:

```typescript
const INTEREST_SET_CONFIGS: InterestSetConfig[] = [
  // Bestehende Sets...
  {
    id: 'eindeutige-id',
    title: 'Anzeige-Titel',
    description: 'Beschreibung des Interest Sets',
    hashtags: ['hashtag1', 'hashtag2', 'hashtag3'],
  },
];
```

3. Die Änderung ist sofort aktiv nach einem Build/Neustart

### Option 1: Statische Interest Sets (Empfohlen für einfache Fälle)

**Wann statische Sets verwenden:**
- Die Hashtags sind stabil und benötigen keine häufigen Updates
- Du möchtest volle Kontrolle über die angezeigten Inhalte
- Remote-Verwaltung ist nicht erforderlich

**Beispiel:**

```typescript
const INTEREST_SET_CONFIGS: InterestSetConfig[] = [
  {
    id: 'tech-innovation',
    title: 'Tech & Innovation',
    description: 'Folge den neuesten Entwicklungen in Technologie, Startups und digitaler Innovation.',
    hashtags: ['tech', 'innovation', 'startup', 'ai', 'programmierung'],
  },
];
```

### Option 2: Pointer-basierte Interest Sets (Remote-Steuerung)

Füge einen Pointer hinzu, um auf ein Nostr Event zu verweisen:

```typescript
const INTEREST_SET_CONFIGS: InterestSetConfig[] = [
  {
    id: 'eindeutige-id',
    title: 'Fallback-Titel',
    description: 'Fallback-Beschreibung wenn Event nicht gefunden.',
    hashtags: ['fallback1', 'fallback2'], // Wird verwendet wenn Event-Abruf fehlschlägt
    pointer: {
      kind: 30000,  // Addressable Event Kind
      pubkey: 'hex-pubkey-des-autors',
      identifier: 'interest-set-identifier',
    },
  },
];
```

**Wann pointer-basierte Sets verwenden:**
- Du möchtest Hashtags remote ohne Code-Änderungen aktualisieren
- Mehrere Instanzen sollen dieselbe Konfiguration teilen
- Inhalte werden von einem bestimmten Kurator verwaltet (identifiziert durch pubkey)

### So findet man die benötigten Werte

Um ein pointer-basiertes Interest Set zu konfigurieren, benötigst du:

1. **pubkey**: Die Nostr Public Key (hex format) des Erstellers
2. **identifier**: Der Wert des `d` Tags des Interest Set Events
3. **kind**: Typ des Nostr Events (typischerweise 30000 für addressable events)

## Interest Set Struktur

### Event Format (Pointer-basierte Sets)

Ein pointer-basiertes Interest Set Event hat folgende Struktur:

```json
{
  "kind": 30000,
  "content": "",
  "tags": [
    ["d", "eindeutiger-identifier"],
    ["title", "Interest Set Titel"],
    ["description", "Beschreibung des Interest Sets"],
    ["image", "https://example.com/image.jpg"],
    ["t", "hashtag1"],
    ["t", "hashtag2"],
    ["t", "hashtag3"]
  ]
}
```

### Tag Bedeutung

- **`d` tag** (erforderlich): Eindeutiger Identifier für das Interest Set
- **`title` tag** (erforderlich): Anzeigename des Sets
- **`t` tags** (erforderlich): Hashtags (mehrere `t` tags, eines pro Hashtag)
- **`description` tag** (optional): Beschreibungstext
- **`image` tag** (optional): URL zum Header-Bild

## Fallback-Verhalten

Das System implementiert graceful degradation:

1. **Pointer-basierte Sets mit Relay-Timeout**: Verwendet konfigurierte Hashtags als Fallback
2. **Event nicht gefunden**: Nutzt konfigurierte title, description und hashtags
3. **Event gefunden**: Nutzt Event-Daten, überschreibt konfigurierte Werte
4. **Keine Hashtags nach Verarbeitung**: Interest Set wird herausgefiltert und nicht angezeigt

Dies stellt sicher, dass Nutzer immer Inhalte sehen, auch wenn Relays langsam oder nicht verfügbar sind.

## Komponenten

### `InterestSetsSection`

Zeigt alle konfigurierten Interest Sets an.

**Verwendung:**

```tsx
import { InterestSetsSection } from '@/components/InterestSetsSection';
import { useInterestSets } from '@/hooks/useInterestSets';

function HomePage() {
  const { data: interestSets, isLoading, isError } = useInterestSets();

  return (
    <div>
      <InterestSetsSection 
        interestSets={interestSets}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
}
```

**Features:**
- Skeleton Loading States
- Error Handling
- Responsives Grid Layout (1/2/3 Spalten)
- Automatisches Ausblenden wenn keine Sets vorhanden

### `InterestSetCard`

Zeigt ein einzelnes Interest Set an.

**Props:**
- `interestSet: InterestSet` - Das anzuzeigende Set-Objekt

**Features:**
- Zeigt alle Hashtags als Badges
- Follow/Unfollow Button
- Automatische Anzeige von Titel, Beschreibung und Bild
- Responsive Design

## Hooks

### `useInterestSets()`

Lädt die konfigurierten Interest Sets.

```typescript
const { data: interestSets, isLoading, isError } = useInterestSets();
```

**Rückgabewerte:**
- `data: InterestSet[]` - Array der geladenen Sets
- `isLoading: boolean` - Lade-Status
- `isError: boolean` - Fehler-Status

**Features:**
- 3 Sekunden Timeout für Event-Abruf
- 10 Minuten Cache
- 2 Retry-Versuche
- Paralleles Laden mehrerer pointer-basierter Sets
- Automatisches Filtern von Sets ohne Hashtags

## TypeScript Typen

```typescript
interface InterestSetConfig {
  /** Stable identifier for React list rendering and fallback usage. */
  id: string;
  title: string;
  description?: string;
  image?: string;
  hashtags: string[];
  pointer?: InterestSetPointer;
}

interface InterestSetPointer {
  kind: number;
  pubkey: string;
  identifier: string;
}

interface InterestSet {
  id: string;
  title: string;
  description?: string;
  image?: string;
  hashtags: string[];
  pointer?: InterestSetPointer;
  event?: NostrEvent;
  pointerValue?: string;
}
```

## Erstellen eines eigenen Interest Set Events

### Option 1: Programmatisch

```typescript
import { useNostrPublish } from '@/hooks/useNostrPublish';

function CreateInterestSet() {
  const { mutate: publish } = useNostrPublish();

  const createSet = () => {
    publish({
      kind: 30000,
      content: '',
      tags: [
        ['d', 'mein-interest-set'],
        ['title', 'Bildungsexperten Deutschland'],
        ['description', 'Folge interessanten Bildungsthemen in Deutschland'],
        ['image', 'https://example.com/education.jpg'],
        ['t', 'bildung'],
        ['t', 'lernen'],
        ['t', 'schule'],
        ['t', 'university'],
      ],
    });
  };

  return <button onClick={createSet}>Interest Set erstellen</button>;
}
```

### Option 2: Mit nostr-tools CLI

```bash
# Event erstellen und signieren
npm install -g nostr-tools
nostr publish -k 30000 -t d:mein-set -t title:"Mein Set" -t t:bildung -t t:lernen ...
```

## Konfiguration per Environment

Für verschiedene Deployments können unterschiedliche Sets verwendet werden:

```typescript
// In src/hooks/useInterestSets.ts

const INTEREST_SET_CONFIGS = import.meta.env.VITE_INTEREST_SETS
  ? JSON.parse(import.meta.env.VITE_INTEREST_SETS)
  : [
      // Default sets
      {
        id: 'lernen-bildung',
        title: 'Lernen & Bildung',
        description: 'Kuratiert Inhalte rund um offene Bildung.',
        hashtags: ['bildung', 'lernen', 'edtech'],
      },
    ];
```

Dann in `.env`:

```bash
VITE_INTEREST_SETS='[{"id":"tech","title":"Tech","hashtags":["tech","ai"]}]'
```

## Best Practices

1. **Aussagekräftige IDs wählen**: Verwende beschreibende, URL-sichere Identifier (Kleinbuchstaben, Bindestriche)
2. **Fallback-Werte bereitstellen**: Füge immer title, description und hashtags für pointer-basierte Sets hinzu
3. **Passende Hashtags verwenden**: Wähle populäre, relevante Hashtags für bessere Content-Discovery
4. **Mit langsamen/offline Relays testen**: Überprüfe, dass Fallback-Verhalten funktioniert
5. **Beschreibungen kurz halten**: 1-2 Sätze, die das Thema klar erklären
6. **Nutzersprache beachten**: Passe die Sprache an deine Zielgruppe an
7. **Anzahl begrenzen**: 3-8 Sets sind ideal, um Nutzer nicht zu überfordern

## Troubleshooting

### "Keine Interest Sets gefunden"

**Mögliche Ursachen:**
- Interest Set Events sind nicht auf den konfigurierten Relays verfügbar
- Falsche pubkey oder identifier Werte
- Netzwerk-Timeout (Standard: 3 Sekunden)
- Alle Sets haben leere Hashtag-Arrays

**Lösung:**
1. Prüfe die Relay-Verbindungen in den DevTools
2. Verifiziere die pubkey/identifier Werte
3. Erhöhe den Timeout in `useInterestSets.ts`
4. Prüfe, ob das Event auf den Relays existiert
5. Stelle sicher, dass mindestens ein Set Hashtags definiert hat

### "Interest Sets werden nicht angezeigt"

**Mögliche Ursachen:**
- `InterestSetsSection` erhält keine Props
- Alle Sets haben leere Hashtag-Arrays

**Lösung:**
- Verwende den `useInterestSets()` Hook und übergebe die Daten an die Section-Komponente
- Prüfe, dass die konfigurierten Sets Hashtags enthalten

### "Pointer-basierte Sets zeigen Fallback-Daten"

**Mögliche Ursachen:**
- Events sind nicht auf den Relays verfügbar
- Relay-Timeout (3 Sekunden)
- Falsche Event-Struktur

**Lösung:**
1. Prüfe, ob das Event mit korrekter Struktur existiert
2. Verifiziere, dass das Event auf deinen konfigurierten Relays verfügbar ist
3. Erhöhe den Timeout wenn nötig
4. Prüfe Relay-Logs in den DevTools

## Verwandte Dateien

- **Hook**: `src/hooks/useInterestSets.ts` - Konfiguration und Lade-Logik
- **Section Komponente**: `src/components/InterestSetsSection.tsx` - Darstellungs-Wrapper
- **Card Komponente**: `src/components/InterestSetCard.tsx` - Einzelne Set-Anzeige
- **Verwendung**: Siehe Pages wie `RegisterPage.tsx` oder `WelcomePage.tsx` für Implementierungsbeispiele

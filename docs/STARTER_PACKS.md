# Starter Packs Configuration

Starter Packs sind kuratierte Listen von Nostr-Profilen, denen Nutzer gemeinsam folgen können, um schnell interessante Accounts zu entdecken. Sie implementieren **NIP-51 kind 39089**.

## Übersicht

Starter Packs ermöglichen es:
- Administratoren, kuratierte Listen interessanter Profile zu erstellen und zu teilen
- Nutzern, mit einem Klick mehreren Profilen gleichzeitig zu folgen
- Communities, Empfehlungen für neue Nutzer zu standardisieren

## Wo werden Starter Packs konfiguriert?

### Hardcodierte Starter Packs (Standard)

Die empfohlenen Starter Packs werden **hardcodiert** in der Datei konfiguriert:

**`src/hooks/useStarterPacks.ts`**

```typescript
// Hardcoded starter pack identifiers - these can be configured per deployment
const STARTER_PACK_IDENTIFIERS = [
  {
    kind: 39089,
    pubkey: 'd6d214fe27fcc0a691dd0f04d152b7cdda7f61f96f26dc421df46af0bb51792e',
    identifier: 'p9ny0auxlpoa',
  },
  // Weitere Starter Packs hier hinzufügen...
];
```

**Wie man einen neuen Starter Pack hinzufügt:**

1. Öffne `src/hooks/useStarterPacks.ts`
2. Füge ein neues Objekt zum `STARTER_PACK_IDENTIFIERS` Array hinzu:

```typescript
const STARTER_PACK_IDENTIFIERS = [
  // Bestehende Packs...
  {
    kind: 39089,
    pubkey: '<nostr-pubkey-des-erstellers>',
    identifier: '<eindeutiger-identifier>', // Der 'd' tag des Events
  },
];
```

3. Die Änderung ist sofort aktiv nach einem Build/Neustart

### So findet man die benötigten Werte

Um einen existierenden Starter Pack zu konfigurieren, benötigst du:

1. **pubkey**: Die Nostr Public Key (hex format) des Erstellers
2. **identifier**: Der Wert des `d` Tags des Starter Pack Events
3. **kind**: Immer `39089` für Starter Packs (NIP-51)

## Starter Pack Struktur

### Event Format (NIP-51 kind 39089)

Ein Starter Pack Event hat folgende Struktur:

```json
{
  "kind": 39089,
  "content": "",
  "tags": [
    ["d", "eindeutiger-identifier"],
    ["title", "Starter Pack Titel"],
    ["description", "Beschreibung des Starter Packs"],
    ["image", "https://example.com/image.jpg"],
    ["p", "pubkey1", "wss://relay.example.com", "Anzeigename 1"],
    ["p", "pubkey2", "wss://relay.example.com", "Anzeigename 2"],
    ["p", "pubkey3", "", ""]
  ]
}
```

### Tag Bedeutung

- **`d` tag** (erforderlich): Eindeutiger Identifier für den Starter Pack
- **`title` tag** (optional): Anzeigename des Packs
- **`description` tag** (optional): Beschreibungstext
- **`image` tag** (optional): URL zum Header-Bild
- **`p` tags** (erforderlich): Profile im Pack
  - Erster Wert: pubkey des Profils
  - Zweiter Wert: bevorzugter Relay (optional)
  - Dritter Wert: Petname/Anzeigename (optional)

## Erstellen eines eigenen Starter Packs

### Option 1: Mit einem Nostr Client

Nutze einen kompatiblen Nostr Client, der NIP-51 Starter Packs unterstützt (z.B. following.space).

### Option 2: Programmatisch

```typescript
import { useNostrPublish } from '@/hooks/useNostrPublish';

function CreateStarterPack() {
  const { mutate: publish } = useNostrPublish();

  const createPack = () => {
    publish({
      kind: 39089,
      content: '',
      tags: [
        ['d', 'mein-starter-pack'],
        ['title', 'Bildungsexperten Deutschland'],
        ['description', 'Folge interessanten Bildungsakteuren in Deutschland'],
        ['image', 'https://example.com/education.jpg'],
        ['p', 'pubkey1', 'wss://relay.damus.io', 'Alice'],
        ['p', 'pubkey2', 'wss://relay.nostr.band', 'Bob'],
        ['p', 'pubkey3', '', 'Charlie'],
      ],
    });
  };

  return <button onClick={createPack}>Starter Pack erstellen</button>;
}
```

### Option 3: Mit nostr-tools CLI

```bash
# Event erstellen und signieren
npm install -g nostr-tools
nostr publish -k 39089 -t d:mein-pack -t title:"Mein Pack" -t p:pubkey1 ...
```

## Komponenten

### `StarterPacksSection`

Zeigt alle konfigurierten Starter Packs an.

**Verwendung:**

```tsx
import { StarterPacksSection } from '@/components/StarterPacksSection';

function HomePage() {
  return (
    <div>
      <StarterPacksSection />
    </div>
  );
}
```

**Features:**
- Automatisches Laden der Packs aus `useStarterPacks`
- Skeleton Loading States
- Error Handling
- Responsives Grid Layout (1/2/3 Spalten)

### `StarterPackCard`

Zeigt einen einzelnen Starter Pack an.

**Props:**
- `pack: StarterPack` - Das anzuzeigende Pack-Objekt

**Features:**
- Zeigt bis zu 3 Profile als Vorschau
- Follow Button mit Status-Anzeige
- Folge-Zähler
- Automatische Profil-Metadata Anzeige

## Hooks

### `useStarterPacks()`

Lädt die konfigurierten Starter Packs.

```typescript
const { data: starterPacks, isLoading, isError } = useStarterPacks();
```

**Rückgabewerte:**
- `data: StarterPack[]` - Array der geladenen Packs
- `isLoading: boolean` - Lade-Status
- `isError: boolean` - Fehler-Status

**Features:**
- 3 Sekunden Timeout
- 10 Minuten Cache
- 2 Retry-Versuche
- Paralleles Laden mehrerer Packs

### `useAllStarterPacks()`

Lädt ALLE verfügbaren Starter Packs im Netzwerk (nicht nur die konfigurierten).

```typescript
const { data: allPacks } = useAllStarterPacks();
```

**Verwendung:**
- Für Discovery-Features
- Für Suchfunktionen
- Für Admin-Interfaces

**Unterschied zu `useStarterPacks()`:**
- `useStarterPacks()`: Nur hardcodierte Packs (für Homepage)
- `useAllStarterPacks()`: Alle Packs im Netzwerk (für Browse/Search)

## TypeScript Typen

```typescript
interface StarterPackProfile {
  pubkey: string;
  relay?: string;
  petname?: string;
}

interface StarterPack {
  event: NostrEvent;
  identifier: string;
  title?: string;
  description?: string;
  image?: string;
  profiles: StarterPackProfile[];
}
```

## Konfiguration per Environment

Für verschiedene Deployments können unterschiedliche Packs verwendet werden:

```typescript
// In src/hooks/useStarterPacks.ts

const STARTER_PACK_IDENTIFIERS = import.meta.env.VITE_STARTER_PACKS
  ? JSON.parse(import.meta.env.VITE_STARTER_PACKS)
  : [
      // Default packs
      {
        kind: 39089,
        pubkey: 'd6d214fe27fcc0a691dd0f04d152b7cdda7f61f96f26dc421df46af0bb51792e',
        identifier: 'p9ny0auxlpoa',
      },
    ];
```

Dann in `.env`:

```bash
VITE_STARTER_PACKS='[{"kind":39089,"pubkey":"...","identifier":"..."}]'
```

## Best Practices

1. **Kuratiere sorgfältig**: Starter Packs repräsentieren deine Plattform
2. **Halte sie aktuell**: Entferne inaktive Profile, füge neue hinzu
3. **Verschiedene Themen**: Erstelle Packs für verschiedene Interessengebiete
4. **Metadaten nutzen**: Füge aussagekräftige Titel, Beschreibungen und Bilder hinzu
5. **Relay Hints**: Gib zuverlässige Relays an für bessere Erreichbarkeit
6. **Petnames verwenden**: Kurze, einprägsame Namen für Profile

## Troubleshooting

### "Keine Starter Packs gefunden"

**Mögliche Ursachen:**
- Starter Pack Events sind nicht auf den konfigurierten Relays verfügbar
- Falsche pubkey oder identifier Werte
- Netzwerk-Timeout (Standard: 3 Sekunden)

**Lösung:**
1. Prüfe die Relay-Verbindungen in den DevTools
2. Verifiziere die pubkey/identifier Werte
3. Erhöhe den Timeout in `useStarterPacks.ts`
4. Prüfe, ob das Event auf den Relays existiert

### "Follow funktioniert nicht"

**Mögliche Ursachen:**
- Nutzer nicht eingeloggt
- Signer unterstützt kind 3 Events nicht
- Relay-Veröffentlichung fehlgeschlagen

**Lösung:**
1. Prüfe `useCurrentUser()` für Login-Status
2. Teste mit verschiedenen Signers (Browser Extension, NIP-46, etc.)
3. Prüfe Relay-Logs in den DevTools

### "Profile werden nicht angezeigt"

**Mögliche Ursachen:**
- Profile haben kein kind 0 Metadata Event
- Metadata Events sind nicht auf den Relays verfügbar

**Lösung:**
- Fallback auf `genUserName(pubkey)` ist bereits implementiert
- Prüfe ob `useAuthor` Hook korrekt konfiguriert ist

## Siehe auch

- [NIP-51: Lists](https://github.com/nostr-protocol/nips/blob/master/51.md) - Spezifikation für Nostr Listen
- [NIP-02: Contact List](https://github.com/nostr-protocol/nips/blob/master/02.md) - Follow List Format
- [following.space](https://following.space) - Tool zum Erstellen von Starter Packs

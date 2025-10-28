"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { finalizeEvent, generateSecretKey, getPublicKey } from "nostr-tools/pure";
import * as nip19 from "nostr-tools/nip19";
import { Download, Copy } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { bytesToHex, hexToBytes } from '@noble/hashes/utils'
import { useNostr } from "nostr-react";

// Type definition for our profile data
interface ProfileData {
  name: string;
  about: string;
  website: string;
  profileImage: string | null;
}

export default function DownloadPage() {
  const { publish } = useNostr();

  const [privateKey, setPrivateKey] = useState<Uint8Array | null>(null);
  const [nsec, setNsec] = useState<string | null>(null);
  const [npub, setNpub] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("Anonym"); // Default to "Anonym" if no name is found

  // Generate keys on component mount and load profile data
  useEffect(() => {
    // First check if keys already exist in localStorage
    try {
      const savedKeys = localStorage.getItem("nostr-keys");
      if (savedKeys) {
        const parsedKeys = JSON.parse(savedKeys);
        if (parsedKeys.nsec && parsedKeys.npub) {
          // Use existing keys if they're found
          setNsec(parsedKeys.nsec);
          setNpub(parsedKeys.npub);
          setPrivateKey(hexToBytes(parsedKeys.nsecHex));

          // We don't necessarily need the raw private/public keys for display purposes
          console.log("Using existing keys from localStorage");
        } else {
          // Generate new keys if saved keys are incomplete
          generateAndSaveNewKeys();
        }
      } else {
        // No keys found, generate new ones
        generateAndSaveNewKeys();
      }
    } catch (error) {
      console.error("Error reading from localStorage, will generate new keys:", error);
      generateAndSaveNewKeys();
    }

    // Load profile data from localStorage
    try {
      const savedData = localStorage.getItem("nostr-profile-data");
      if (savedData) {
        const parsedData: ProfileData = JSON.parse(savedData);
        if (parsedData.name) {
          setUserName(parsedData.name);
        }
      }
    } catch (error) {
      console.error("Failed to load profile data from localStorage:", error);
    }
  }, []);

  // Function to generate and save new keys
  const generateAndSaveNewKeys = () => {
    const newPrivateKey = generateSecretKey();
    const newPublicKey = getPublicKey(newPrivateKey);
    const newNsec = nip19.nsecEncode(newPrivateKey);
    const newNpub = nip19.npubEncode(newPublicKey);

    setPrivateKey(newPrivateKey);
    setNsec(newNsec);
    setNpub(newNpub);

    // Store the keys in localStorage for future use in the app
    try {
      localStorage.setItem("nostr-keys", JSON.stringify({
        nsec: newNsec,
        npub: newNpub,
        nsecHex: bytesToHex(newPrivateKey),
      }));
    } catch (error) {
      console.error("Failed to save keys to localStorage:", error);
    }
  };

  const downloadNsec = () => {
    if (!nsec) return;

    // Get profile data from localStorage
    let profileInfo = "";
    try {
      const savedData = localStorage.getItem("nostr-profile-data");
      if (savedData) {
        const parsedData: ProfileData = JSON.parse(savedData);
        profileInfo = `
--------------------------------------------------------------
DEINE PROFILINFORMATIONEN (ZUR REFERENZ):
--------------------------------------------------------------
Name: ${parsedData.name || ''}
Über mich: ${parsedData.about || ''}
Website: ${parsedData.website || ''}
--------------------------------------------------------------`;
      }
    } catch (error) {
      console.error("Error accessing profile data:", error);
    }

    // Create a text file with a clear warning and the nsec key
    const fileContent = `ACHTUNG: DIES IST DEIN PRIVATER NOSTR-SCHLÜSSEL!
TEILE DIESEN SCHLÜSSEL MIT NIEMANDEM UND HALTE IHN SICHER!
Jeder mit diesem Schlüssel kann dein Nostr-Profil kontrollieren.
--------------------------------------------------------------

${nsec}

Hex:
${privateKey ? bytesToHex(privateKey) : ''}
--------------------------------------------------------------
Speichere diesen Schlüssel in einem sicheren Passwort-Manager.
${profileInfo}`;

    const element = document.createElement("a");
    const file = new Blob([fileContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "nostr-nsec.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const [copyNpubSuccess, setCopyNpubSuccess] = useState(false);
  const [copyNsecSuccess, setCopyNsecSuccess] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [profilePublished, setProfilePublished] = useState(false);

  const handleCopyNpub = async (text: string) => {
    await copyToClipboard(text);
    setCopyNpubSuccess(true);
    setTimeout(() => setCopyNpubSuccess(false), 2000);
  };

  const handleCopyNsec = async (text: string) => {
    await copyToClipboard(text);
    setCopyNsecSuccess(true);
    setTimeout(() => setCopyNsecSuccess(false), 2000);
  };

  const handleDownload = () => {
    downloadNsec();
    setDownloadSuccess(true);
    // setTimeout(() => setDownloadSuccess(false), 2000);
  };

  const handleNostrPublish = () => {
    if (!privateKey) {
      alert("Private key is not available for publishing.");
      return;
    }
    if (localStorage.getItem("nostr-profile-data") === null) {
      alert("Profile data not found. Please complete your profile before publishing.");
      return;
    }

    const event = finalizeEvent({
      kind: 0,
      created_at: Math.floor(Date.now() / 1000),
      tags: [],
      content: localStorage.getItem("nostr-profile-data") || "",
    }, privateKey)

    // Publish to relays
    publish(event);

    setProfilePublished(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header with theme toggle */}
      <header className="w-full p-4 md:p-6 flex justify-end">
        <div className="absolute top-4 right-4 md:top-6 md:right-6">
          <ThemeToggle />
        </div>
      </header>

      <div className="container mx-auto py-8 px-4 md:py-16 md:px-6">
        <div className="flex flex-col md:flex-row gap-8 items-start max-w-5xl mx-auto">
          {/* Text content - Left on desktop, Top on mobile */}
          <div className="md:w-1/2 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-1 h-12 bg-primary"></div>
                <div>
                  <h1 className="text-3xl font-bold">
                    DEINE <br />
                    SCHLÜSSEL <br />
                    <span className="text-primary">SIND BEREIT</span>
                  </h1>
                </div>
              </div>
            </div>

            <p className="text-lg">
              Gut gemacht <span className="font-medium">{userName}</span>, dein Nostr-Profil ist fertig!
              Ja, es war so einfach.
            </p>

            <div className="space-y-4">
              <p>
                Bei Nostr wird dein Schlüsselpaar durch zwei einzigartige Zeichenfolgen
                identifiziert:
              </p>

              <ul className="list-disc ml-6 space-y-2">
                <li>
                  Der <span className="font-mono">npub</span>-Schlüssel ist dein öffentlicher
                  Profilcode, den du mit jedem teilen kannst. Er beginnt immer mit &quot;npub1&quot;.
                </li>
                <li>
                  Der <span className="font-mono">nsec</span>-Schlüssel ist dein privater Schlüssel.
                  Er beginnt immer mit &quot;nsec1&quot; und wird verwendet, um dein Profil zu
                  kontrollieren und Notizen zu veröffentlichen. Dieser muss absolut
                  geheim gehalten werden.
                </li>
              </ul>

              <p>
                Bitte kopiere beide Schlüssel und lade zusätzlich deinen nsec
                als Textdatei herunter. Speichere ihn an einem sicheren Ort, zum Beispiel in
                deinem Passwort-Manager.
              </p>
            </div>
          </div>

          {/* Key info and actions - Right on desktop, Bottom on mobile */}
          <div className="md:w-1/2 bg-muted/30 dark:bg-muted/10 p-6 rounded-lg space-y-6 w-full">
            <div className="space-y-2">
              <p className="text-gray-700 dark:text-gray-300">Dein npub ist</p>
              <div className="relative">
                <p className="font-mono text-sm break-all bg-background dark:bg-background/30 p-3 rounded-md border">
                  {npub || "Wird generiert..."}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => npub && handleCopyNpub(npub)}
                  disabled={!npub}
                  title="In die Zwischenablage kopieren"
                >
                  {copyNpubSuccess ? (
                    <span className="text-xs text-green-500">Kopiert!</span>
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Dies ist dein öffentlicher Schlüssel, den du mit anderen teilen kannst.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-gray-700 dark:text-gray-300">Dein nsec ist</p>
              <div className="relative">
                <p className="font-mono text-sm break-all bg-background dark:bg-background/30 p-3 rounded-md border">
                  {nsec || "Wird generiert..."}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => nsec && handleCopyNsec(nsec)}
                  disabled={!nsec}
                  title="In die Zwischenablage kopieren"
                >
                  {copyNsecSuccess ? (
                    <span className="text-xs text-green-500">Kopiert!</span>
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="flex items-start space-x-2 p-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-md">
                <div className="text-amber-500 mt-0.5">⚠️</div>
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  <span className="font-semibold">Wichtig:</span> Das ist dein privater Schlüssel. Bewahre ihn sicher auf und teile ihn NIE mit anderen! Jeder mit diesem Schlüssel kann dein Nostr-Profil kontrollieren.
                </p>
              </div>
            </div>

            <Button
              onClick={handleDownload}
              className={`w-full font-medium ${downloadSuccess ? 'bg-green-600 hover:bg-green-700' : ''}`}
              disabled={!nsec}
            >
              {downloadSuccess ? (
                <>
                  <span className="mr-2">✓</span>
                  Gespeichert!
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Speichere meinen nsec
                </>
              )}
            </Button>

            <Button
              disabled={!downloadSuccess}
              onClick={handleNostrPublish}
              className={`w-full font-medium`}
            >
              Veröffentliche dein Profil
            </Button>

            {/* <div className="mt-4"> */}
            <Button
              onClick={() => {
                const enableKeycloak = process.env.NEXT_PUBLIC_ENABLE_KEYCLOAK_SYNC === "true";
                window.location.href = enableKeycloak ? "/keycloak" : "/done";
              }}
              className="w-full font-medium"
              disabled={!downloadSuccess || !profilePublished}
              variant="default"
            >
              Weiter zum nächsten Schritt
            </Button>
            {/* </div> */}

            {/* <button 
            className="w-full text-center text-sm text-primary hover:underline cursor-pointer"
            onClick={() => alert('Diese Funktion ist noch nicht verfügbar.')}
          >
            Ich möchte die verschlüsselte Version herunterladen
          </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}

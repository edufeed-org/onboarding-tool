import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header with theme toggle */}
      <header className="w-full p-4 md:p-6 flex justify-end">
        <div className="absolute top-4 right-4 md:top-6 md:right-6">
          <ThemeToggle />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 p-6 md:p-12 max-w-7xl mx-auto">
        {/* Image - visible at the top on mobile, on the right on desktop */}
        <div className="md:hidden w-full flex justify-center mt-2 mb-6">
          <Image
            src="/relay.png"
            alt="Nostr Relay Illustration"
            width={300}
            height={300}
            className="object-contain max-h-[250px]"
            priority
          />
        </div>

        {/* Text content */}
        <div className="flex-1 space-y-6 text-center md:text-left max-w-xl md:max-w-none">
          <div className="space-y-2 relative pl-0 md:pl-6 flex flex-col items-center md:items-start">
            <div className="hidden md:block absolute left-0 top-0 bottom-0 w-1.5 bg-primary rounded-full"></div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              <span className="block">WILLKOMMEN</span>
              <span className="block">
                BEI <span className="text-primary">NOSTR</span>
              </span>
            </h1>
          </div>

          <div className="space-y-5 max-w-2xl">
            <p className="text-base md:text-lg">
              Um Nostr beizutreten, brauchst du ein Profil, aber nicht das übliche, das ein Unternehmen für dich erstellt und verwaltet. Du erstellst es selbst, keine Genehmigungen erforderlich.
            </p>

            <p className="text-base md:text-lg">
              Nostr ist von Anfang an eine andere Erfahrung: Da es keine zentrale Autorität gibt, die sich darum kümmert, wer wer ist, wird jeder Benutzer durch ein kryptografisches Schlüsselpaar identifiziert; keine Sorge wegen des technischen Jargons, es ist nur ein starkes Passwort, das du sicher aufbewahren musst.
            </p>

            <p className="text-base md:text-lg">
              Dieser Assistent ist eine von vielen Möglichkeiten, um ein Nostr-Profil zu erstellen, das du später in anderen Apps verwenden kannst. Wir helfen dir, dein Schlüsselpaar zu erstellen und es in wenigen Schritten sicher zu verwalten. Bist du bereit?
            </p>
          </div>
          <div className="pt-6">
            <a href="/yourself">
              <Button size="lg" className="text-lg h-14 px-10 rounded-md bg-primary hover:bg-primary/90">
                <span>Los geht&apos;s</span>
                <span className="ml-2">→</span>
              </Button>
            </a>
          </div>

          <div className="pt-6 text-sm">
            <p className="mb-1 opacity-90">Möchtest du zuerst mehr über Nostr erfahren?</p>
            <a href="#" className="text-primary underline hover:text-primary/80">
              Lies eine kurze Einführung
            </a>
          </div>
        </div>

        {/* Image - only visible on desktop */}
        <div className="hidden md:flex flex-1 justify-end max-w-md mt-0">
          <Image
            src="/relay.png"
            alt="Nostr Relay Illustration"
            width={500}
            height={500}
            className="object-contain max-h-[500px]"
            priority
          />
        </div>
      </main>
    </div>
  );
}

"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import AppIcon from "@/components/app-icon";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ReactConfetti from 'react-confetti';

export default function DonePage() {
    const router = useRouter();
    const [nostrProfileUrl, setNostrProfileUrl] = useState("njump.me/your-npub-here");
    const [username, setUsername] = useState("Anonym");
    
    // Confetti state
    const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });
    const [showConfetti, setShowConfetti] = useState(true);

    // Array of Nostr apps
    const nostrApps = [
        {
            name: "Coracle",
            icon: "/apps/coracle.svg",
            type: "Social & Microblogging",
            platform: "Web app",
            link: "https://coracle.social"
        },
        {
            name: "Chachi",
            icon: "/apps/chachi.svg",
            type: "Gruppengespräche",
            platform: "Web app",
            link: "https://chachi.nostr.com"
        },
        {
            name: "Olas",
            icon: "/apps/olas.svg",
            type: "Foto- & Video-Social",
            platform: "Android / iOS",
            link: "https://olas.social"
        },
        {
            name: "Nostur",
            icon: "/apps/nostur.svg",
            type: "Social & Microblogging",
            platform: "iOS / macOS",
            link: "https://nostur.com"
        },
        {
            name: "Jumble.social",
            icon: "/apps/jumble.svg",
            type: "Social & Microblogging",
            platform: "Web app",
            link: "https://jumble.social"
        }
    ];

    // Handle localStorage access in useEffect (client-side only)
    useEffect(() => {
        // Only run on the client side
        const storedKeys = localStorage.getItem("nostr-keys") || null;
        const data = localStorage.getItem("nostr-profile-data") || null;

        if (data) {
            try {
                const profileData = JSON.parse(data);
                if (profileData.name) {
                    setUsername(profileData.name);
                }
            } catch (error) {
                console.error("Failed to parse profile data:", error);
            }
        }

        if (storedKeys) {
            try {
                const keys = JSON.parse(storedKeys);
                if (keys.npub) {
                    setNostrProfileUrl(`njump.me/${keys.npub}`);
                }
            } catch (error) {
                console.error("Failed to parse stored keys:", error);
            }
        } else {
            // redirect to home if no keys found in localStorage
            router.push("/");
        }
        
        // Set window dimensions for confetti
        setWindowDimensions({ 
            width: window.innerWidth, 
            height: window.innerHeight 
        });
        
        // Auto-hide confetti after 10 seconds
        const timer = setTimeout(() => {
            setShowConfetti(false);
        }, 10000);
        
        // Handle window resize for confetti
        const handleResize = () => {
            setWindowDimensions({ 
                width: window.innerWidth, 
                height: window.innerHeight 
            });
        };
        
        window.addEventListener('resize', handleResize);
        
        // Cleanup function
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timer);
        };
    }, [router]); // Add router to dependencies array

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            {/* Confetti overlay */}
            {showConfetti && (
                <ReactConfetti
                    width={windowDimensions.width}
                    height={windowDimensions.height}
                    recycle={false}
                    numberOfPieces={500}
                    gravity={0.1}
                    colors={['#ff0080', '#7928ca', '#0070f3', '#00b4d8', '#f5f5f5']}
                />
            )}
            
            {/* Header with theme toggle */}
            <header className="w-full p-4 md:p-6 flex justify-end">
                <div className="absolute top-4 right-4 md:top-6 md:right-6">
                    <ThemeToggle />
                </div>
            </header>

            {/* Main content */}
            <main className="flex-1 flex flex-col items-center justify-start p-6 md:p-12 max-w-7xl mx-auto w-full">
                {/* Heading with pink accent line */}
                <div className="w-full max-w-4xl mb-8 md:mb-12">
                    <div className="relative pl-0 md:pl-6 flex flex-col items-center md:items-start">
                        <div className="hidden md:block absolute left-0 top-0 bottom-0 w-1.5 bg-primary rounded-full"></div>
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                            <span className="block text-muted-foreground">ERKUNDE</span>
                            <span className="block">NOSTR</span>
                        </h1>
                    </div>
                </div>

                {/* Welcome text */}
                <div className="w-full max-w-3xl mb-12">
                    <p className="text-lg">
                        Wir sind fertig, <span className="font-bold">{username}</span>! Jetzt kannst du beginnen,
                        Nostr zu erkunden, indem du eine Web-Anwendung verwendest oder eine App
                        herunterlädst. Hier sind einige Vorschläge, um sofort loszulegen:
                    </p>
                </div>

                {/* App grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8 w-full max-w-4xl mb-12">
                    {nostrApps.map((app, index) => (
                        <a
                            key={index}
                            href={app.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center text-center group transition-transform hover:scale-105"
                        >
                            <div className="mb-4 w-20 h-20 md:w-24 md:h-24 relative flex items-center justify-center">
                                <AppIcon
                                    src={app.icon}
                                    alt={`${app.name} icon`}
                                    width={96}
                                    height={96}
                                    className="object-contain"
                                />
                            </div>
                            <h3 className="font-medium text-lg mb-1">{app.name}</h3>
                            <p className="text-xs text-muted-foreground mb-1">{app.type}</p>
                            <p className="text-xs text-primary">{app.platform}</p>
                        </a>
                    ))}
                </div>

                {/* "This is just a small selection" text */}
                <div className="w-full max-w-3xl mb-8">
                    <p className="text-base">
                        Dies ist nur eine kleine Auswahl der über 80 Anwendungen, die bereits auf Nostr entwickelt wurden,
                        <a href="https://nostr.com/apps" className="text-primary hover:underline ml-1">
                            entdecke sie alle!
                        </a>
                    </p>
                </div>

                {/* Profile URL section */}
                <div className="w-full max-w-3xl mb-12">
                    <p className="text-base mb-2">
                        Dies ist dein Web-Profil, du kannst es überall und mit jedem teilen:
                    </p>
                    <div className="bg-secondary/50 p-3 rounded-md font-mono text-sm overflow-x-auto break-all">
                        {nostrProfileUrl}
                    </div>
                </div>

                {/* Back to home button and confetti button */}
                <div className="w-full max-w-3xl flex justify-center gap-4">
                    <Link href="/">
                        <Button variant="outline" size="lg" className="px-6">
                            Zurück zur Startseite
                        </Button>
                    </Link>
                    <Button 
                        variant="outline" 
                        size="lg" 
                        className="px-6"
                        onClick={() => setShowConfetti(true)}
                    >
                        🎉 Nochmal feiern!
                    </Button>
                </div>
            </main>
        </div>
    );
}

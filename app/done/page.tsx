"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import ReactConfetti from 'react-confetti';
import { useStarterPacks, StarterPack } from "@/hooks/useStarterPacks";
import { useNip02Contacts } from "@/hooks/useNip02Contacts";
import { StarterPackCard, StarterPackCardSkeleton } from "@/components/starter-pack-card";

export default function DonePage() {
    const router = useRouter();
    const [nostrProfileUrl, setNostrProfileUrl] = useState("njump.me/your-npub-here");
    const [username, setUsername] = useState("Anonym");
    const [userKeys, setUserKeys] = useState<{ npub: string; nsec: string } | null>(null);
    
    // Confetti state
    const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });
    const [showConfetti, setShowConfetti] = useState(true);

    // Starter packs configuration
    const [showPredefinedPacks, setShowPredefinedPacks] = useState(false);
    
    // Memoize the predefined pack IDs to prevent unnecessary re-renders
    const predefinedPackIds = useMemo(() => [
        "p9ny0auxlpoa"
    ], []); // Empty dependency array since these IDs are static

    // Load starter packs
    const starterPacksOptions = useMemo(() => ({
        predefinedPacks: showPredefinedPacks ? predefinedPackIds : undefined,
        limit: 6
    }), [showPredefinedPacks, predefinedPackIds]);
    
    const { starterPacks, loading: packsLoading, error: packsError, refresh } = useStarterPacks(starterPacksOptions);

    // Initialize NIP-02 contacts hook with user keys
    const { followStarterPack } = useNip02Contacts({
        userPubkey: userKeys?.npub,
        userPrivateKey: userKeys?.nsec,
        enableAutoSync: false // Don't need auto-sync on the done page
    });

    // Handle following a starter pack
    const handleFollowPack = async (starterPack: StarterPack) => {
        if (userKeys?.nsec && followStarterPack) {
            try {
                await followStarterPack(starterPack.profiles);
                console.log('Successfully followed starter pack:', starterPack.title);
            } catch (error) {
                console.error('Error following starter pack:', error);
                // Fallback to the old behavior if following fails
                alert(`Folge ${starterPack.profiles.length} Profilen aus "${starterPack.title}"`);
            }
        } else {
            // Fallback for when keys are not available
            console.log('Following starter pack:', starterPack);
            alert(`Folge ${starterPack.profiles.length} Profilen aus "${starterPack.title}"`);
        }
    };

    // Handle viewing starter pack details
    const handleViewPackDetails = (starterPack: StarterPack) => {
        // Open in a new window or show modal with details
        window.open(`https://following.space/d/${starterPack.identifier}`, '_blank');
    };

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
                // Store the keys for the contacts hook
                setUserKeys(keys);
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
                <div className="w-full max-w-3xl mb-8">
                    <p className="text-lg">
                        Wir sind fertig, <span className="font-bold">{username}</span>! Jetzt kannst du beginnen,
                        Nostr zu erkunden, indem du interessanten Leuten folgst. Hier sind einige
                        kuratierte Starter-Packs, um sofort loszulegen:
                    </p>
                </div>

                {/* Pack type toggle */}
                <div className="w-full max-w-3xl mb-6">
                    <div className="flex gap-2 p-1 bg-secondary/50 rounded-lg">
                        <button
                            onClick={() => setShowPredefinedPacks(false)}
                            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                !showPredefinedPacks 
                                    ? 'bg-primary text-primary-foreground shadow-sm' 
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            Neueste Packs
                        </button>
                        <button
                            onClick={() => setShowPredefinedPacks(true)}
                            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                showPredefinedPacks 
                                    ? 'bg-primary text-primary-foreground shadow-sm' 
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            Empfohlene Packs
                        </button>
                    </div>
                </div>

                {/* Starter packs grid */}
                <div className="w-full max-w-5xl mb-8">
                    {packsError && (
                        <div className="text-center p-6 text-muted-foreground">
                            <p className="mb-4">Fehler beim Laden der Starter-Packs: {packsError}</p>
                            <Button variant="outline" onClick={refresh}>
                                Erneut versuchen
                            </Button>
                        </div>
                    )}
                    
                    {packsLoading && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <StarterPackCardSkeleton key={index} />
                            ))}
                        </div>
                    )}

                    {!packsLoading && !packsError && starterPacks.length === 0 && (
                        <div className="text-center p-6 text-muted-foreground">
                            <p className="mb-4">
                                {showPredefinedPacks 
                                    ? 'Keine empfohlenen Starter-Packs gefunden.'
                                    : 'Keine neuen Starter-Packs gefunden.'
                                }
                            </p>
                            <Button variant="outline" onClick={() => setShowPredefinedPacks(!showPredefinedPacks)}>
                                {showPredefinedPacks ? 'Neueste anzeigen' : 'Empfohlene anzeigen'}
                            </Button>
                        </div>
                    )}

                    {!packsLoading && !packsError && starterPacks.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {starterPacks.map((pack) => (
                                <StarterPackCard
                                    key={pack.id}
                                    starterPack={pack}
                                    onFollow={handleFollowPack}
                                    onViewDetails={handleViewPackDetails}
                                    userPubkey={userKeys?.npub}
                                    userPrivateKey={userKeys?.nsec}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* "This is just a small selection" text */}
                <div className="w-full max-w-3xl mb-8">
                    <p className="text-base">
                        Dies sind kuratierte Listen von interessanten Personen auf Nostr.
                        <a href="https://nostr.com/apps" className="text-primary hover:underline ml-1">
                            Entdecke auch die über 80 verfügbaren Apps!
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

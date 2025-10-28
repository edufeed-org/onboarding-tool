"use client";

import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Type definition for our profile data
interface ProfileData {
  name: string;
  about: string;
  website: string;
  profileImage: string | null;
}

export default function Yourself() {
  // State for form fields
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [about, setAbout] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  
  const router = useRouter();
  
  // Load data from localStorage on component mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem("nostr-profile-data");
      if (savedData) {
        const parsedData: ProfileData = JSON.parse(savedData);
        setName(parsedData.name || "");
        setAbout(parsedData.about || "");
        setWebsite(parsedData.website || "");
        setProfileImage(parsedData.profileImage);
      }
    } catch (error) {
      console.error("Failed to load profile data from localStorage:", error);
    }
  }, []);
  
  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (e.target?.result) {
          const imageData = e.target.result as string;
          setProfileImage(imageData);
          
          // Save to localStorage immediately when image is updated
          saveToLocalStorage({
            name,
            about,
            website,
            profileImage: imageData
          });
        }
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  // Save data to localStorage
  const saveToLocalStorage = (data: ProfileData) => {
    try {
      localStorage.setItem("nostr-profile-data", JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save profile data to localStorage:", error);
    }
  };
  
  // Handle form submission
  const handleContinue = () => {
    // Save current form data to localStorage
    saveToLocalStorage({
      name,
      about,
      website,
      profileImage
    });
    
    // Navigate to the next page
    router.push("/download");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header with theme toggle */}
      <header className="w-full p-4 md:p-6 flex justify-end">
        <div className="absolute top-4 right-4 md:top-6 md:right-6">
          <ThemeToggle />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col p-6 md:p-12 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:gap-12 w-full">
          {/* Left side - Text content */}
          <div className="w-full md:w-1/2 space-y-6 mb-12 md:mb-0">
            {/* Heading */}
            <div className="space-y-2 relative pl-0 md:pl-6 flex flex-col">
              <div className="hidden md:block absolute left-0 top-0 bottom-0 w-1.5 bg-primary rounded-full"></div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                <span className="text-muted-foreground">STELL DICH</span><br />
                <span>VOR</span>
              </h1>
            </div>

            {/* Introductory text */}
            <div className="space-y-6 text-base md:text-lg">
              <p>
                Bei Nostr entscheidest du, wer du sein möchtest.
              </p>
              
              <p>
                Ein Nostr-Profil enthält normalerweise einen Namen, ein Bild und einige
                zusätzliche Informationen, aber alles ist optional.
              </p>
              
              <p>
                Der Name ist kein eindeutiger Benutzername, wir können so viele Jacks 
                haben, wie wir wollen! Verwende deinen echten Namen oder einen 
                Spitznamen; du kannst ihn später jederzeit ändern.
                Aber denk daran: Online-Privatsphäre ist wichtig, teile keine sensiblen Daten.
              </p>
              
              <p>
                Und ja, um Nostr beizutreten, musst du weder deine E-Mail-Adresse,
                Telefonnummer noch andere identifizierende Informationen angeben.
              </p>
            </div>
          </div>

          {/* Right side - Profile form */}
          <div className="w-full md:w-1/2 space-y-8">
            {/* Profile image */}
            <div className="flex flex-col items-center">
              <label htmlFor="profile-image" className="cursor-pointer group">
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-muted bg-muted/20 flex items-center justify-center">
                  {profileImage ? (
                    <Image
                      src={profileImage}
                      alt="Profilbild"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                  )}
                </div>
                <input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleImageUpload}
                />
                <p className="mt-2 text-center text-sm">Dein Bild</p>
                <p className="mt-1 text-xs text-muted-foreground text-center">OPTIONAL</p>
              </label>
            </div>

            {/* Name field */}
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Dein (Spitz-)Name"
                className="w-full px-4 py-3 bg-background border border-input rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => saveToLocalStorage({ name, about, website, profileImage })}
              />
              <p className="text-xs text-muted-foreground">ERFORDERLICH</p>
            </div>

            {/* About field */}
            <div className="space-y-2">
              <textarea
                placeholder="Etwas über dich"
                rows={4}
                className="w-full px-4 py-3 bg-background border border-input rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                onBlur={() => saveToLocalStorage({ name, about, website, profileImage })}
              />
              <p className="text-xs text-muted-foreground">OPTIONAL</p>
            </div>

            {/* Website field */}
            <div className="space-y-2">
              <input
                type="url"
                placeholder="Deine Website"
                className="w-full px-4 py-3 bg-background border border-input rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                onBlur={() => saveToLocalStorage({ name, about, website, profileImage })}
              />
              <p className="text-xs text-muted-foreground">OPTIONAL</p>
            </div>

            {/* Submit button */}
            <div className="pt-6 flex justify-end">
              <Button 
                size="lg" 
                className="text-lg px-8 rounded-md"
                onClick={handleContinue}
                disabled={!name.trim()} // Disable if name is empty
              >
                <span>Fortfahren</span>
                <span className="ml-2">→</span>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

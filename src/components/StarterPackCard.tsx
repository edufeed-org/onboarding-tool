import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, Check } from "lucide-react";
import { type StarterPack } from "@/hooks/useStarterPacks";
import { useAuthor } from "@/hooks/useAuthor";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useNostrPublish } from "@/hooks/useNostrPublish";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNostr } from "@nostrify/react";
import { useState } from "react";
import { genUserName } from "@/lib/genUserName";

interface ProfilePreviewProps {
  pubkey: string;
  petname?: string;
}

function ProfilePreview({ pubkey, petname }: ProfilePreviewProps) {
  const author = useAuthor(pubkey);
  const metadata = author.data?.metadata;

  const displayName = petname || metadata?.name || metadata?.display_name || genUserName(pubkey);
  const avatarUrl = metadata?.picture;

  return (
    <div className="flex items-center gap-2 min-w-0">
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={avatarUrl} alt={displayName} />
        <AvatarFallback className="text-xs">
          {displayName.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span className="text-sm truncate">{displayName}</span>
    </div>
  );
}

interface StarterPackCardProps {
  pack: StarterPack;
}

export function StarterPackCard({ pack }: StarterPackCardProps) {
  const { user } = useCurrentUser();
  const { nostr } = useNostr();
  const { mutate: publish, isPending: isPublishing } = useNostrPublish();
  const [isFollowing, setIsFollowing] = useState(false);
  const queryClient = useQueryClient();

  // Get current user's follow list (kind 3)
  const { data: followList } = useQuery({
    queryKey: ['follow-list', user?.pubkey],
    queryFn: async ({ signal }) => {
      if (!user?.pubkey) return null;
      
      const [event] = await nostr.query(
        [{ kinds: [3], authors: [user.pubkey], limit: 1 }],
        { signal: AbortSignal.any([signal, AbortSignal.timeout(1500)]) }
      );
      
      return event;
    },
    enabled: !!user?.pubkey,
    staleTime: 60 * 1000, // 1 minute
  });

  // Check if already following these profiles
  const currentFollows = followList?.tags.filter(([name]) => name === 'p').map(([, pubkey]) => pubkey) || [];
  const packPubkeys = pack.profiles.map(p => p.pubkey);
  const alreadyFollowingCount = packPubkeys.filter(pk => currentFollows.includes(pk)).length;
  const isFullyFollowing = alreadyFollowingCount === packPubkeys.length && packPubkeys.length > 0;

  const handleFollowPack = async () => {
    if (!user) return;
    
    setIsFollowing(true);

    // Get existing follows
    const existingFollows = currentFollows;

    // Add new follows from the pack (avoiding duplicates)
    const newFollows = packPubkeys.filter(pk => !existingFollows.includes(pk));
    
    // Build the new follow list tags
    const followTags = [
      ...followList?.tags.filter(([name]) => name === 'p') || [],
      ...newFollows.map(pubkey => {
        const profile = pack.profiles.find(p => p.pubkey === pubkey);
        return ['p', pubkey, profile?.relay || '', profile?.petname || ''] as [string, string, string, string];
      })
    ];

    // Publish the updated follow list
    publish(
      {
        kind: 3,
        content: followList?.content || '',
        tags: followTags,
      },
      {
        onSuccess: () => {
          setIsFollowing(false);
          if (user?.pubkey) {
            queryClient.invalidateQueries({ queryKey: ['follow-list', user.pubkey] });
          }
        },
        onError: () => {
          setIsFollowing(false);
        }
      }
    );
  };

  // Display up to 5 profile previews
  const previewProfiles = pack.profiles.slice(0, 5);
  const remainingCount = Math.max(0, pack.profiles.length - 5);

  return (
    <Card className="border-2 hover:shadow-lg transition-all h-full flex flex-col">
      <CardHeader className="pb-3">
        {pack.image && (
          <div className="w-full h-32 mb-3 rounded-lg overflow-hidden bg-muted">
            <img 
              src={pack.image} 
              alt={pack.title || 'Starter pack'} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg line-clamp-2">
              {pack.title || 'Starter Pack'}
            </CardTitle>
            <CardDescription className="mt-1.5 line-clamp-2">
              {pack.description || 'Eine kuratierte Liste empfohlener Profile zum Folgen'}
            </CardDescription>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="secondary" className="gap-1.5">
            <Users className="h-3 w-3" />
            {pack.profiles.length} {pack.profiles.length === 1 ? 'Profil' : 'Profile'}
          </Badge>
          {alreadyFollowingCount > 0 && (
            <Badge variant="outline" className="gap-1.5 text-green-600 border-green-600">
              <Check className="h-3 w-3" />
              {alreadyFollowingCount} folgst du bereits
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-4">
        {/* Profile Previews */}
        <div className="space-y-2 flex-1">
          {previewProfiles.map((profile) => (
            <ProfilePreview 
              key={profile.pubkey} 
              pubkey={profile.pubkey} 
              petname={profile.petname}
            />
          ))}
          {remainingCount > 0 && (
            <div className="text-sm text-muted-foreground pl-10">
              und {remainingCount} weitere...
            </div>
          )}
        </div>

        {/* Follow Button */}
        <Button
          onClick={handleFollowPack}
          disabled={!user || isPublishing || isFollowing || isFullyFollowing}
          className="w-full"
          variant={isFullyFollowing ? "outline" : "default"}
        >
          {isFullyFollowing ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Folgst du bereits
            </>
          ) : isPublishing || isFollowing ? (
            <>Wird aktualisiert...</>
          ) : (
            <>
              <UserPlus className="h-4 w-4 mr-2" />
              Allen folgen
            </>
          )}
        </Button>

        {!user && (
          <p className="text-xs text-center text-muted-foreground">
            Melde dich an, um diesem Pack zu folgen
          </p>
        )}
      </CardContent>
    </Card>
  );
}

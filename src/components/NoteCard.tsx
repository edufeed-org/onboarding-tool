import { type NostrEvent } from '@nostrify/nostrify';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuthor } from '@/hooks/useAuthor';
import { genUserName } from '@/lib/genUserName';
import { NoteContent } from '@/components/NoteContent';

interface NoteCardProps {
  note: NostrEvent;
}

export function NoteCard({ note }: NoteCardProps) {
  const author = useAuthor(note.pubkey);
  const metadata = author.data?.metadata;

  const displayName = metadata?.display_name || metadata?.name || genUserName(note.pubkey);
  const username = metadata?.name || genUserName(note.pubkey);
  const profileImage = metadata?.picture;

  // Extract hashtags from the note
  const hashtags = note.tags
    .filter(([name]) => name === 't')
    .map(([, value]) => value);

  // Format timestamp
  const timestamp = new Date(note.created_at * 1000);
  const timeAgo = getTimeAgo(timestamp);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={profileImage} alt={displayName} />
            <AvatarFallback>{displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold truncate">{displayName}</span>
              {username !== displayName && (
                <span className="text-sm text-muted-foreground truncate">@{username}</span>
              )}
            </div>
            <time className="text-xs text-muted-foreground" dateTime={timestamp.toISOString()}>
              {timeAgo}
            </time>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="whitespace-pre-wrap break-words">
          <NoteContent event={note} className="text-sm" />
        </div>
        {hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {hashtags.map((tag, index) => (
              <Badge key={`${tag}-${index}`} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Get a human-readable time ago string from a date
 */
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}mo ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears}y ago`;
}

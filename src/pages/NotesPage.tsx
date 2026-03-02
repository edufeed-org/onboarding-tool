import { useSeoMeta } from '@unhead/react';
import { Newspaper } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/PageHeader';
import { useNotes } from '@/hooks/useNotes';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { NoteCard } from '@/components/NoteCard';
import { LoginArea } from '@/components/auth/LoginArea';

export default function NotesPage() {
  useSeoMeta({
    title: 'Notizen - Nostr Onboarding',
    description: 'Entdecke Notizen basierend auf deinen Interessen.',
  });

  const { user } = useCurrentUser();
  const { data: notes, isLoading, error } = useNotes();

  return (
    <div className="min-h-screen bg-background">
      <PageHeader />

      <div className="container mx-auto px-4 py-20">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center space-y-6 mb-12">
          <Newspaper className="h-16 w-16 mx-auto text-blue-600" />
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
            Notizen zu deinen Interessen
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Entdecke Inhalte aus dem Nostr-Netzwerk, gefiltert nach deinen Interessensgruppen. Hier erscheinen Notizen, die zu den von dir ausgewählten Hashtags passen.
          </p>
        </div>

        {/* Login Required State */}
        {!user && (
          <div className="max-w-2xl mx-auto">
            <Card className="border-dashed">
              <CardContent className="py-12 px-8 text-center space-y-6">
                <div className="max-w-sm mx-auto space-y-6">
                  <p className="text-muted-foreground">
                    Bitte melde dich an, um Notizen basierend auf deinen Interessen zu sehen.
                  </p>
                  <LoginArea className="flex justify-center" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Loading State */}
        {user && isLoading && (
          <div className="max-w-2xl mx-auto space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {user && error && (
          <div className="max-w-2xl mx-auto">
            <Card className="border-dashed border-red-200">
              <CardContent className="py-12 px-8 text-center">
                <p className="text-muted-foreground">
                  Notizen konnten nicht geladen werden. Bitte versuche es später noch einmal.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {user && !isLoading && !error && notes?.length === 0 && (
          <div className="max-w-2xl mx-auto">
            <Card className="border-dashed">
              <CardContent className="py-12 px-8 text-center">
                <div className="max-w-sm mx-auto space-y-6">
                  <p className="text-muted-foreground">
                    Keine Notizen gefunden, die zu deinen Interessen passen. Versuche Interessensgruppen im 
                    {' '}
                    <a href="/user-dashboard" className="text-blue-600 hover:underline">
                      Dashboard
                    </a>
                    {' '}
                    hinzuzufügen oder warte kurz, bis Inhalte von deinen Relays geladen werden.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Notes Grid */}
        {user && !isLoading && !error && notes && notes.length > 0 && (
          <div className="max-w-2xl mx-auto space-y-4">
            {notes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

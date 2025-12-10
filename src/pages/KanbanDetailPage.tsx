import { useSeoMeta } from '@unhead/react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Kanban, Lock, Globe, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/PageHeader';
import { useKanbanBoard } from '@/hooks/useKanbanBoard';
import { useAuthor } from '@/hooks/useAuthor';

function BoardColumnView({ columnId, columnName, cards }: { columnId: string; columnName: string; cards: any[] }) {
  const columnCards = cards.filter(card => card.columnId === columnId);

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-muted rounded-lg p-3">
        <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
          {columnName}
        </h3>
        <span className="text-xs text-muted-foreground ml-2">
          {columnCards.length} {columnCards.length === 1 ? 'card' : 'cards'}
        </span>
      </div>
      
      <div className="space-y-2 min-h-[100px]">
        {columnCards.map((card) => (
          <Card key={card.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="p-4">
              <CardTitle className="text-base">{card.title}</CardTitle>
              {card.description && (
                <CardDescription className="text-sm line-clamp-2">
                  {card.description}
                </CardDescription>
              )}
            </CardHeader>
            {(card.assignees.length > 0 || card.attachments.length > 0) && (
              <CardContent className="p-4 pt-0">
                <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
                  {card.assignees.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{card.assignees.length}</span>
                    </div>
                  )}
                  {card.attachments.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {card.attachments.length} {card.attachments.length === 1 ? 'attachment' : 'attachments'}
                    </Badge>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
        {columnCards.length === 0 && (
          <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
            No cards in this column
          </div>
        )}
      </div>
    </div>
  );
}

export default function KanbanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: board, isLoading, error } = useKanbanBoard(id || '');
  const author = useAuthor(board?.event.pubkey || '');

  useSeoMeta({
    title: board ? `${board.title} - Kanban Board` : 'Kanban Board',
    description: board?.description || 'View Kanban board details on Nostr.',
  });

  return (
    <div className="min-h-screen bg-background">
      <PageHeader />

      <div className="container mx-auto px-4 py-20">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto mb-6">
          <Button variant="ghost" asChild>
            <Link to="/kanbans" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Boards
            </Link>
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="max-w-7xl mx-auto space-y-8">
            <Card>
              <CardHeader>
                <div className="space-y-4">
                  <Skeleton className="h-8 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                </div>
              </CardHeader>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto">
            <Card className="border-dashed border-red-200">
              <CardContent className="py-12 px-8 text-center">
                <p className="text-muted-foreground">
                  Failed to load Kanban board. The board may not exist or your relay connections may be down.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Board Details */}
        {!isLoading && !error && board && (
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Board Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Kanban className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <CardTitle className="text-3xl mb-2">{board.title}</CardTitle>
                      {board.description && (
                        <CardDescription className="text-base">
                          {board.description}
                        </CardDescription>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3 flex-wrap">
                      {board.pubState === 'published' ? (
                        <Badge variant="default" className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          Public
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Lock className="h-3 w-3" />
                          Private
                        </Badge>
                      )}
                      <Badge variant="outline">
                        {board.columns.length} {board.columns.length === 1 ? 'column' : 'columns'}
                      </Badge>
                      <Badge variant="outline">
                        {board.cards.length} {board.cards.length === 1 ? 'card' : 'cards'}
                      </Badge>
                      {board.maintainers.length > 0 && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {board.maintainers.length} {board.maintainers.length === 1 ? 'maintainer' : 'maintainers'}
                        </Badge>
                      )}
                    </div>

                    {author.data?.metadata && (
                      <div className="text-sm text-muted-foreground">
                        Created by{' '}
                        <span className="font-medium">
                          {author.data.metadata.name || author.data.metadata.display_name || 'Anonymous'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Columns and Cards */}
            {board.columns.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {board.columns.map((column) => (
                  <BoardColumnView
                    key={column.id}
                    columnId={column.id}
                    columnName={column.name}
                    cards={board.cards}
                  />
                ))}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="py-12 px-8 text-center">
                  <p className="text-muted-foreground">
                    This board has no columns yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

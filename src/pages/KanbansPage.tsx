import { useSeoMeta } from '@unhead/react';
import { Kanban } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/PageHeader';
import { useKanbanBoards } from '@/hooks/useKanbanBoards';
import { KanbanBoardCard } from '@/components/KanbanBoardCard';

export default function KanbansPage() {
  useSeoMeta({
    title: 'Kanban Boards - Nostr Onboarding',
    description: 'Explore and manage Kanban boards on Nostr.',
  });

  const { data: boards, isLoading, error } = useKanbanBoards();

  return (
    <div className="min-h-screen bg-background">
      <PageHeader />

      <div className="container mx-auto px-4 py-20">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center space-y-6 mb-12">
          <Kanban className="h-16 w-16 mx-auto text-blue-600" />
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
            Kanban Boards
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore decentralized Kanban boards on the Nostr network. 
            Organize tasks, track progress, and collaborate with visual workflows.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
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
        {error && (
          <div className="max-w-2xl mx-auto">
            <Card className="border-dashed border-red-200">
              <CardContent className="py-12 px-8 text-center">
                <p className="text-muted-foreground">
                  Failed to load Kanban boards. Please try again later.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && boards?.length === 0 && (
          <div className="max-w-2xl mx-auto">
            <Card className="border-dashed">
              <CardContent className="py-12 px-8 text-center">
                <div className="max-w-sm mx-auto space-y-6">
                  <p className="text-muted-foreground">
                    No Kanban boards found. Check your relay connections or wait a moment for content to load.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Boards Grid */}
        {!isLoading && !error && boards && boards.length > 0 && (
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boards.map((board) => (
              <KanbanBoardCard key={board.id} board={board} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

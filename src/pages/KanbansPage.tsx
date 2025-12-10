import { useSeoMeta } from '@unhead/react';
import { Kanban } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNostr } from '@nostrify/react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PageHeader } from '@/components/PageHeader';
import { useKanbanBoards, type KanbanBoard } from '@/hooks/useKanbanBoards';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useFollowList } from '@/hooks/useFollowList';
import { KanbanBoardCard } from '@/components/KanbanBoardCard';
import { LoginArea } from '@/components/auth/LoginArea';

export default function KanbansPage() {
  useSeoMeta({
    title: 'Kanban Boards - Nostr Onboarding',
    description: 'Explore and manage Kanban boards on Nostr.',
  });

  const [activeTab, setActiveTab] = useState<'all' | 'interests' | 'following'>('all');
  const { user } = useCurrentUser();
  const { nostr } = useNostr();
  const { data: boards, isLoading, error } = useKanbanBoards();
  const { data: followList = [] } = useFollowList();

  // Get user's interest hashtags (kind 10015)
  const { data: interestHashtags = [] } = useQuery<string[]>({
    queryKey: ['interest-hashtags', user?.pubkey],
    queryFn: async ({ signal }) => {
      if (!user?.pubkey) return [];

      const [interestList] = await nostr.query(
        [{ kinds: [10015], authors: [user.pubkey], limit: 1 }],
        { signal: AbortSignal.any([signal, AbortSignal.timeout(1500)]) }
      );

      const hashtags = interestList?.tags
        .filter(([name]) => name === 't')
        .map(([, value]) => value.toLowerCase()) ?? [];

      return hashtags;
    },
    enabled: !!user?.pubkey,
  });

  // Filter boards based on active tab
  const filteredBoards = useMemo(() => {
    if (!boards) return [];

    switch (activeTab) {
      case 'all':
        return boards;
      
      case 'interests':
        if (interestHashtags.length === 0) return [];
        return boards.filter((board) => {
          // Check if board has any hashtags that match user's interests
          const boardHashtags = board.event.tags
            .filter(([name]) => name === 't')
            .map(([, value]) => value.toLowerCase());
          return boardHashtags.some((tag) => interestHashtags.includes(tag));
        });
      
      case 'following':
        if (followList.length === 0) return [];
        return boards.filter((board) => {
          // Check if board creator or maintainers are in follow list
          const boardPubkeys = [
            board.event.pubkey,
            ...board.event.tags
              .filter(([name]) => name === 'p')
              .map(([, pubkey]) => pubkey)
          ];
          return boardPubkeys.some((pubkey) => followList.includes(pubkey));
        });
      
      default:
        return boards;
    }
  }, [boards, activeTab, interestHashtags, followList]);

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

        {/* Tabs for filtering */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)} className="max-w-6xl mx-auto mb-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="all">All Boards</TabsTrigger>
            <TabsTrigger value="interests" disabled={!user}>My Interests</TabsTrigger>
            <TabsTrigger value="following" disabled={!user}>Following</TabsTrigger>
          </TabsList>

          {/* All Boards Tab */}
          <TabsContent value="all" className="mt-8">
            {isLoading && <LoadingSkeleton />}
            {error && <ErrorState />}
            {!isLoading && !error && filteredBoards.length === 0 && <EmptyState />}
            {!isLoading && !error && filteredBoards.length > 0 && <BoardsGrid boards={filteredBoards} />}
          </TabsContent>

          {/* My Interests Tab */}
          <TabsContent value="interests" className="mt-8">
            {!user ? (
              <LoginPrompt message="Log in to see Kanban boards based on your interest hashtags." />
            ) : isLoading ? (
              <LoadingSkeleton />
            ) : error ? (
              <ErrorState />
            ) : filteredBoards.length === 0 ? (
              <EmptyState 
                message="No Kanban boards found matching your interests. Follow some hashtags to see relevant boards here!" 
              />
            ) : (
              <BoardsGrid boards={filteredBoards} />
            )}
          </TabsContent>

          {/* Following Tab */}
          <TabsContent value="following" className="mt-8">
            {!user ? (
              <LoginPrompt message="Log in to see Kanban boards from people you follow." />
            ) : isLoading ? (
              <LoadingSkeleton />
            ) : error ? (
              <ErrorState />
            ) : filteredBoards.length === 0 ? (
              <EmptyState 
                message="No Kanban boards found from people you follow. Start following users to see their boards here!" 
              />
            ) : (
              <BoardsGrid boards={filteredBoards} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Helper Components
function LoadingSkeleton() {
  return (
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
  );
}

function ErrorState() {
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-dashed border-red-200">
        <CardContent className="py-12 px-8 text-center">
          <p className="text-muted-foreground">
            Failed to load Kanban boards. Please try again later.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function EmptyState({ message }: { message?: string }) {
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-dashed">
        <CardContent className="py-12 px-8 text-center">
          <div className="max-w-sm mx-auto space-y-6">
            <p className="text-muted-foreground">
              {message || 'No Kanban boards found. Check your relay connections or wait a moment for content to load.'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function LoginPrompt({ message }: { message: string }) {
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-dashed">
        <CardContent className="py-12 px-8 text-center space-y-6">
          <div className="max-w-sm mx-auto space-y-6">
            <p className="text-muted-foreground">{message}</p>
            <LoginArea className="flex justify-center" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function BoardsGrid({ boards }: { boards: KanbanBoard[] }) {
  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {boards.map((board) => (
        <KanbanBoardCard key={board.id} board={board} />
      ))}
    </div>
  );
}

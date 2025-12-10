import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { KanbanBoard } from '@/hooks/useKanbanBoards';
import { useAuthor } from '@/hooks/useAuthor';
import { genUserName } from '@/lib/genUserName';

interface KanbanBoardCardProps {
  board: KanbanBoard;
}

export function KanbanBoardCard({ board }: KanbanBoardCardProps) {
  const navigate = useNavigate();
  const author = useAuthor(board.event.pubkey);
  const metadata = author.data?.metadata;

  const displayName = metadata?.name || metadata?.display_name || genUserName(board.event.pubkey);
  const profileImage = metadata?.picture;

  const handleClick = () => {
    // Navigate to the detail page using the board's full id (kind:pubkey:d-tag)
    navigate(`/kanban/${encodeURIComponent(board.id)}`);
  };

  // Extract column count
  const columnCount = board.event.tags.filter(([name]) => name === 'col').length;

  return (
    <Card 
      className="cursor-pointer transition-all hover:shadow-lg hover:border-blue-300"
      onClick={handleClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl truncate">{board.title}</CardTitle>
            {board.description && (
              <CardDescription className="mt-2 line-clamp-2">
                {board.description}
              </CardDescription>
            )}
            <div className="flex items-center gap-2 mt-3">
              <Avatar className="h-6 w-6">
                <AvatarImage src={profileImage} alt={displayName} />
                <AvatarFallback>{displayName[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground truncate">
                {displayName}
              </span>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 flex-wrap">
          {board.pubState === 'published' ? (
            <Badge variant="default">Public</Badge>
          ) : (
            <Badge variant="secondary">Private</Badge>
          )}
          <Badge variant="outline">
            {columnCount} {columnCount === 1 ? 'column' : 'columns'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

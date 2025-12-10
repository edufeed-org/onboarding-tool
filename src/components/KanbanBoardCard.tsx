import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import type { KanbanBoard } from '@/hooks/useKanbanBoards';

interface KanbanBoardCardProps {
  board: KanbanBoard;
}

export function KanbanBoardCard({ board }: KanbanBoardCardProps) {
  const handleClick = () => {
    // Extract the d-tag identifier from the board id
    const dTag = board.event.tags.find(([name]) => name === 'd')?.[1];
    if (dTag) {
      window.location.href = `https://edufeed-org.github.io/kanban-editor/cardsboard/${dTag}`;
    }
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
          </div>
          <ExternalLink className="h-5 w-5 text-muted-foreground flex-shrink-0" />
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

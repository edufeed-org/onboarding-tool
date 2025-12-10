import { nip19 } from 'nostr-tools';
import { useParams } from 'react-router-dom';
import NotFound from './NotFound';
import { PageHeader } from '@/components/PageHeader';

export function NIP19Page() {
  const { nip19: identifier } = useParams<{ nip19: string }>();

  if (!identifier) {
    return <NotFound />;
  }

  let decoded;
  try {
    decoded = nip19.decode(identifier);
  } catch {
    return <NotFound />;
  }

  const { type } = decoded;

  switch (type) {
    case 'npub':
    case 'nprofile':
      // AI agent should implement profile view here
      return (
        <div className="min-h-screen bg-background">
          <PageHeader />
          <div className="container mx-auto px-4 py-20">
            <div>Profile placeholder</div>
          </div>
        </div>
      );

    case 'note':
      // AI agent should implement note view here
      return (
        <div className="min-h-screen bg-background">
          <PageHeader />
          <div className="container mx-auto px-4 py-20">
            <div>Note placeholder</div>
          </div>
        </div>
      );

    case 'nevent':
      // AI agent should implement event view here
      return (
        <div className="min-h-screen bg-background">
          <PageHeader />
          <div className="container mx-auto px-4 py-20">
            <div>Event placeholder</div>
          </div>
        </div>
      );

    case 'naddr':
      // AI agent should implement addressable event view here
      return (
        <div className="min-h-screen bg-background">
          <PageHeader />
          <div className="container mx-auto px-4 py-20">
            <div>Addressable event placeholder</div>
          </div>
        </div>
      );

    default:
      return <NotFound />;
  }
} 
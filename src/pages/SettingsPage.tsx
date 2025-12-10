import { PageHeader } from '@/components/PageHeader';
import { RelayListManager } from '@/components/RelayListManager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <PageHeader />

      <div className="container max-w-4xl mx-auto px-4 py-20">
        <Card>
          <CardHeader>
            <CardTitle>Relay Settings</CardTitle>
            <CardDescription>
              Manage your Nostr relay connections. Relays are used to read and write events on the Nostr network.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RelayListManager />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

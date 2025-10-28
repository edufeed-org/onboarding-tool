"use client"

import React from "react";
import { NostrProvider } from "nostr-react";

export default function NostrClient({ children }: { children: React.ReactNode }) {
  return (
    <NostrProvider
      relayUrls={["wss://relay.damus.io", "wss://relay.primal.net"]}
      debug={true}
    >
      {children}
    </NostrProvider>
  );
}
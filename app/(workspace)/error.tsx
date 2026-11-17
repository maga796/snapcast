"use client";

import { Button } from "@/components/ui";

export default function WorkspaceError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <section className="rw-card"><h1>Something went wrong</h1><p className="rw-empty" role="alert">This screen could not be loaded.</p><Button onClick={reset}>Try again</Button></section>;
}

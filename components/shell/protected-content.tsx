import { auth } from "@clerk/nextjs/server";
import type { ReactNode } from "react";

export async function ProtectedContent({ children }: { children: ReactNode }) {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) {
    return <section className="rw-card"><h1>Sign-in unavailable</h1><p className="rw-muted">Sign-in is not configured yet. Please try again later.</p></section>;
  }
  await auth.protect();
  return children;
}

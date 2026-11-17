"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { useState } from "react";
import type { ReactNode } from "react";
import { AppShell } from "./app-shell";

export function ShellConnection({ children, authConfigured }: { children: ReactNode; authConfigured: boolean }) {
  return authConfigured ? <ClerkShell>{children}</ClerkShell> : <UnconfiguredShell>{children}</UnconfiguredShell>;
}

function UnconfiguredShell({ children }: { children: ReactNode }) {
  return <AppShell workspaces={[]} activeWorkspaceId={null} account={null} status="idle"
    // TODO(backend): supply workspace/account props and a workspace-change handler.
    onWorkspaceChange={() => {}} signOutDisabled onSignOut={() => {}}>{children}</AppShell>;
}

function ClerkShell({ children }: { children: ReactNode }) {
  const { signOut } = useClerk();
  const { user, isLoaded } = useUser();
  const [error, setError] = useState<string>();
  const name = user?.fullName || user?.username || user?.primaryEmailAddress?.emailAddress;
  return <AppShell workspaces={[]} activeWorkspaceId={null} account={name ? { name, initial: Array.from(name)[0].toLocaleUpperCase() } : null} status={error ? "error" : !isLoaded ? "running" : "idle"} message={error}
    // TODO(backend): supply workspace/account props and a workspace-change handler.
    onWorkspaceChange={() => {}}
    onSignOut={async () => {
      try { await signOut({ redirectUrl: "/sign-in" }); }
      catch { setError("Could not log out. Please try again."); }
    }}>{children}</AppShell>;
}

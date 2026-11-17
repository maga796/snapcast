import { Sora } from "next/font/google";
import { Suspense } from "react";
import { ShellConnection } from "@/components/shell/shell-connection";
import { ScreenState } from "@/components/ui/screen-state";
import "./workspace.css";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" });

export const metadata = { title: "Reelwise", description: "Create videos and track how they are doing." };

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const authConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY);
  return <div className={sora.variable}><Suspense fallback={<div className="rw-shell"><ScreenState title="Reelwise" status="running" /></div>}><ShellConnection authConfigured={authConfigured}>{children}</ShellConnection></Suspense></div>;
}

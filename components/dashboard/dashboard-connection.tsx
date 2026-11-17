"use client";

import { useRouter } from "next/navigation";
import type { DashboardProps } from "@/types";
import { Dashboard } from "./dashboard";

// Client adapter keeps event handlers out of the server page's serialized props.
export function DashboardConnection(props: Omit<DashboardProps, "onCreateVideo" | "onMakeIdea">) {
  const router = useRouter();
  return <Dashboard {...props} onCreateVideo={() => router.push("/create")}
    // TODO(backend): carry the approved idea into the creation brief.
    onMakeIdea={() => router.push("/create")} />;
}

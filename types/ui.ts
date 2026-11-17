import type { ButtonHTMLAttributes, CSSProperties, HTMLAttributes, ReactNode, SVGProps } from "react";

export type IconName = "dashboard" | "create" | "campaigns" | "library" | "publish" | "calendar" | "inbox" | "growth" | "brand" | "accounts" | "billing" | "settings" | "logout" | "more" | "close" | "play" | "pause";
export interface IconProps extends SVGProps<SVGSVGElement> { name: IconName }

export type ActionStatus = "idle" | "running" | "done" | "error";

export interface ActionState {
  status: ActionStatus;
  message?: string;
  steps?: readonly { id: string; label: string; status: ActionStatus }[];
}

export interface Workspace {
  id: string;
  name: string;
}

export interface AccountSummary {
  initial: string;
  name: string;
  plan?: string;
  creditsUsed?: number;
  creditsTotal?: number;
}

export interface AppShellProps {
  children: ReactNode;
  workspaces: readonly Workspace[];
  activeWorkspaceId: string | null;
  onWorkspaceChange: (workspaceId: string) => void;
  account: AccountSummary | null;
  onSignOut: () => void | Promise<void>;
  signOutDisabled?: boolean;
  status: ActionStatus;
  message?: string;
}

export interface ScreenStateProps {
  title: string;
  status: ActionStatus;
  message?: string;
}

export type CardProps = HTMLAttributes<HTMLDivElement>;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary";
  status?: ActionStatus;
}

export type ChipProps = HTMLAttributes<HTMLSpanElement>;

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  dotColor?: string;
}

export interface SwitchProps {
  id?: string;
  label: string;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export interface MeterProps {
  label: string;
  value: number;
  max: number;
}

export interface ToastProps {
  open: boolean;
  message: string;
  tone?: "success" | "error" | "info";
  onDismiss: () => void;
}

export interface PreviewCaption {
  id: string;
  text: string;
  startSeconds: number;
  endSeconds: number;
}

export interface VideoPreviewProps {
  label: string;
  background: CSSProperties["background"];
  appCard: ReactNode;
  captions: readonly PreviewCaption[];
  currentTimeSeconds: number;
  durationSeconds: number;
  playing: boolean;
  cursor?: { xPercent: number; yPercent: number };
  status: ActionStatus;
  message?: string;
  onPlay: () => void;
  onPause: () => void;
}

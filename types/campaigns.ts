import type { ActionStatus } from "./ui";

export type CampaignCadence = "twice-weekly" | "weekdays" | "daily" | "twice-daily";
export type CampaignStage = "Draft" | "Ready" | "Approved";

export interface Campaign {
  id: string;
  name: string;
  paused: boolean;
  stage: CampaignStage;
  nextAdTime: string | null;
  message?: string;
  script: string;
  hookId: string;
  caption: string;
  backgroundId: string;
  voiceId: string;
  fontId: string;
  backgroundMusic: boolean;
  underThirtySeconds: boolean;
  cadence: CampaignCadence;
  skippedDates: readonly string[];
  previewCaption?: string;
  credits?: number;
  regenerateStatus?: ActionStatus;
  approveStatus?: ActionStatus;
  approvalRequestStatus?: ActionStatus;
  pauseStatus?: ActionStatus;
  actionMessage?: string;
}

export interface CampaignPatch {
  script?: string;
  hookId?: string;
  caption?: string;
  backgroundId?: string;
  voiceId?: string;
  fontId?: string;
  backgroundMusic?: boolean;
  underThirtySeconds?: boolean;
  cadence?: CampaignCadence;
}

export interface CampaignHook { id: string; label: string; text: string; predictedHold: string | null }
export interface CampaignOption { id: string; name: string }
export interface CampaignOptions {
  backgrounds: readonly CampaignOption[];
  voices: readonly CampaignOption[];
  fonts: readonly CampaignOption[];
}
export interface CampaignPlatform {
  id: string;
  name: string;
  color: string;
  connected: boolean;
  accountLabel?: string;
  status?: ActionStatus;
  message?: string;
}

export interface CampaignsData {
  campaigns: readonly Campaign[];
  hooks: readonly CampaignHook[];
  options: CampaignOptions;
  platforms: readonly CampaignPlatform[];
  /** YYYY-MM, and YYYY-MM-DD dates in the workspace's timezone. */
  month: string;
  today: string;
  status?: ActionStatus;
  message?: string;
  actionsAvailable?: boolean;
}
export interface CampaignsProps extends CampaignsData {
  onChange: (campaignId: string, patch: CampaignPatch) => void;
  onApprove: (campaignId: string) => void;
  onRequestClientApproval: (campaignId: string) => void;
  onTogglePause: (campaignId: string) => void;
  onRegenerateScript: (campaignId: string) => void;
  onToggleSkipDate: (campaignId: string, date: string) => void;
  onConnectPlatform: (platformId: string, connect: boolean) => void;
  onNewCampaign: () => void;
}
export interface PreflightCheck { id: string; label: string; passed: boolean }
export interface CampaignDay {
  date: string;
  day: number;
  label: string;
  scheduled: boolean;
  skipped: boolean;
  today: boolean;
}
export interface CampaignMonth { title: string; offset: number; days: CampaignDay[]; plannedAds: number }

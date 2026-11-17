import type { ActionState, ActionStatus } from "./ui";
import type { VideoFormat } from "./formats";

export interface SetupOption { id: string; name: string; description?: string }
export interface CaptionStyle extends SetupOption { look: "plain" | "marker" | "word" | "pop" }
export interface SetupVoice extends SetupOption { pro?: boolean }
export interface SetupPlatform extends SetupOption { connected: boolean }
export type PostingDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export interface PlanPreset extends SetupOption { days: readonly PostingDay[]; postsPerDay: number }
export interface FetchedAppDetails { appName?: string; feature?: string }
export interface CreateValues {
  formatId: string;
  appUrl: string;
  appName: string;
  feature: string;
  style: VideoFormat["style"];
  goalId: string;
  files: File[];
  captionStyleId: string;
  languageId: string;
  voiceId: string;
  musicId: string;
  presenterId: string;
  delivery: "publish" | "files";
  platformIds: string[];
  days: PostingDay[];
  postsPerDay: number;
  aspectRatio: "9:16" | "1:1" | "16:9";
}
export interface CreateSetupProps {
  format: VideoFormat;
  goals: readonly SetupOption[];
  captionStyles: readonly CaptionStyle[];
  languages: readonly SetupOption[];
  voices: readonly SetupVoice[];
  musicOptions: readonly SetupOption[];
  presenters: readonly SetupOption[];
  platforms: readonly SetupPlatform[];
  planPresets: readonly PlanPreset[];
  creditsPerVideo: number | null;
  fetchStatus: ActionStatus;
  fetchedDetails?: FetchedAppDetails;
  fetchMessage?: string;
  createStatus: ActionStatus;
  createSteps?: ActionState["steps"];
  createMessage?: string;
  status?: ActionStatus;
  message?: string;
  previewDurationSeconds?: number;
  downloadAvailable?: boolean;
  actionsAvailable?: boolean;
  onBack: () => void;
  onFetchLink: (url: string) => void;
  onUploadFiles: (files: File[]) => void;
  onPlayVoice: (id: string) => void;
  onDownload: () => void;
  onCreate: (values: CreateValues) => void;
}

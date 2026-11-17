import type { ActionState } from "./ui";

export interface DashboardStats {
  views: number;
  likes: number;
  clicks: number;
  scheduled: number;
  viewsChange?: string;
}
export interface PlatformViews { id: string; name: string; color: string; views: number }
export interface DashboardVideo {
  id: string;
  title: string;
  thumbnailUrl?: string;
  platforms: readonly { id: string; name: string; color: string }[];
  views: number;
  likes: number;
  clicks: number;
}
export interface DashboardIdea { id: string; description: string }
export interface DashboardProps extends ActionState {
  stats: DashboardStats | null;
  viewsSeries: readonly number[];
  viewsByPlatform: readonly PlatformViews[];
  videos: readonly DashboardVideo[];
  idea?: DashboardIdea;
  onCreateVideo: () => void;
  onMakeIdea: (idea: DashboardIdea) => void;
}

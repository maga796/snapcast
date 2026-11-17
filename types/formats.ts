import type { ActionState } from "./ui";

export interface VideoFormat {
  id: string;
  name: string;
  category: string;
  badge?: string;
  style: "clean" | "bold" | "dark";
}

export interface FormatGalleryProps extends ActionState {
  formats: readonly VideoFormat[];
  categories: readonly string[];
  onSelectFormat: (id: string) => void;
  onUseOwnRecording: () => void;
}

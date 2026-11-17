import type { CaptionStyle, PlanPreset, SetupOption, SetupPlatform, SetupVoice } from "@/types";

// Approved reference choices, kept separate from the presentational screen.
// Replace provider voices/presenters and platform connection state with backend records.
export const goals: readonly SetupOption[] = [
  { id: "website", name: "Website link", description: "Send viewers to your site" },
  { id: "app-store", name: "App store page", description: "Send viewers to download" },
  { id: "bio", name: "Link in bio", description: "Send viewers to your bio link" },
];
export const captionStyles: readonly CaptionStyle[] = [
  { id: "plain", name: "Plain", look: "plain" }, { id: "marker", name: "Marker", look: "marker" },
  { id: "word", name: "One word at a time", look: "word" }, { id: "pop", name: "Pop", look: "pop" },
];
export const languages: readonly SetupOption[] = [
  { id: "en", name: "English" }, { id: "es", name: "Spanish" }, { id: "fr", name: "French" },
  { id: "pt", name: "Portuguese" }, { id: "de", name: "German" },
];
export const voices: readonly SetupVoice[] = [
  { id: "marcus", name: "Marcus", description: "Deep, authoritative narrator" },
  { id: "ava", name: "Ava", description: "Clear, natural American" },
  { id: "jordan", name: "Jordan", description: "Bright, friendly" },
  { id: "elias", name: "Elias", description: "Smooth, polished", pro: true },
  { id: "nora", name: "Nora", description: "Warm, upbeat", pro: true },
];
export const musicOptions: readonly SetupOption[] = [
  { id: "none", name: "No music" }, { id: "upbeat", name: "Upbeat" }, { id: "cinematic", name: "Cinematic" },
  { id: "lofi", name: "Lo-fi" }, { id: "trending", name: "Trending sounds (TikTok)" },
];
export const presenters: readonly SetupOption[] = [
  { id: "none", name: "None" }, { id: "maya", name: "Maya" }, { id: "leo", name: "Leo" }, { id: "sam", name: "Sam" },
];
export const platforms: readonly SetupPlatform[] = [
  { id: "youtube", name: "YouTube", description: "YouTube Shorts", connected: false },
  { id: "tiktok", name: "TikTok", connected: false }, { id: "instagram", name: "Instagram", connected: false },
  { id: "meta", name: "Meta", connected: false },
];
export const planPresets: readonly PlanPreset[] = [
  { id: "twice-week", name: "Twice a week", days: [1, 4], postsPerDay: 1 },
  { id: "weekdays", name: "Weekdays", days: [1, 2, 3, 4, 5], postsPerDay: 1 },
  { id: "every-day", name: "Every day", days: [0, 1, 2, 3, 4, 5, 6], postsPerDay: 1 },
  { id: "twice-day", name: "Twice a day", days: [0, 1, 2, 3, 4, 5, 6], postsPerDay: 2 },
];

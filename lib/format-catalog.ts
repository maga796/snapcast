import type { VideoFormat } from "@/types";

// Temporary catalog from the approved gallery reference. Replace with backend
// records and video previews when those are available.
export const formatCategories = [
  "Demos",
  "Launches",
  "Tutorials",
  "Stories",
  "Social proof",
] as const;

export const formatCatalog: readonly VideoFormat[] = [
  { id: "product-demo", name: "Product Demo", category: "Demos", badge: "Top pick", style: "clean" },
  { id: "feature-drop", name: "Feature drop", category: "Demos", badge: "Top pick", style: "bold" },
  { id: "launch-teaser", name: "Launch Teaser", category: "Launches", badge: "Rising", style: "dark" },
  { id: "founder-story", name: "Founder Story", category: "Stories", badge: "Top pick", style: "clean" },
  { id: "60-second-how-to", name: "60-second how-to", category: "Tutorials", badge: "Free to try", style: "bold" },
  { id: "before-and-after", name: "Before & After", category: "Demos", badge: "Rising", style: "dark" },
  { id: "changelog-update", name: "Changelog Update", category: "Launches", badge: "Free to try", style: "clean" },
  { id: "customer-story", name: "Customer story", category: "Social proof", badge: "Free to try", style: "bold" },
  { id: "dev-log", name: "Dev Log", category: "Stories", badge: "Rising", style: "dark" },
  { id: "pricing-explained", name: "Pricing explained", category: "Demos", style: "clean" },
  { id: "pain-to-fix", name: "Pain to fix", category: "Launches", badge: "Top pick", style: "bold" },
];

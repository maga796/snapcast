import type { IconName, IconProps } from "@/types";

const paths: Record<IconName, React.ReactNode> = {
  dashboard: <><rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" rx="1"/><rect x="3" y="15" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/></>,
  create: <><circle cx="12" cy="12" r="9"/><path d="M8 12h8m-4-4v8"/></>,
  campaigns: <><path d="m17 2 4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4m14-1v2a3 3 0 0 1-3 3H3"/></>,
  library: <><rect x="3" y="4" width="18" height="16" rx="2"/><path d="m10 8 6 4-6 4Z"/></>,
  publish: <><path d="m22 2-7 20-4-9L2 9 22 2ZM11 13 22 2"/></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></>,
  inbox: <path d="M4 4h16v12H8l-4 4V4Z"/>,
  growth: <path d="m3 17 6-6 4 4 8-10m-6 0h6v6"/>,
  brand: <><circle cx="12" cy="12" r="9"/><circle cx="8" cy="10" r=".7"/><circle cx="12" cy="7" r=".7"/><circle cx="16" cy="10" r=".7"/></>,
  accounts: <><path d="m10 13 4-4m-6 6-1 1a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m2 3 1-1a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0" transform="translate(1 -1)"/></>,
  billing: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/></>,
  settings: <><path d="M3 6h10m4 0h4M3 18h4m4 0h10"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="18" r="2"/></>,
  logout: <><path d="M9 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h5m7-15 5 6-5 6M8 12h13"/></>,
  more: <><circle cx="4" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="20" cy="12" r="1"/></>,
  close: <path d="m6 6 12 12M6 18 18 6"/>,
  play: <path d="m8 4 12 8-12 8Z"/>,
  pause: <><path d="M8 4v16M16 4v16"/></>,
};

export function Icon({ name, ...props }: IconProps) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import type { AppShellProps, IconName } from "@/types";
import { Icon } from "@/components/ui/icon";

const primary = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/create", label: "Create", icon: "create" },
  { href: "/campaigns", label: "Campaigns", icon: "campaigns" },
  { href: "/library", label: "Library", icon: "library" },
  { href: "/publish", label: "Publish", icon: "publish" },
] as const;
const grow = [
  { href: "/calendar", label: "Calendar", icon: "calendar" },
  { href: "/inbox", label: "Inbox", icon: "inbox" },
  { href: "/growth", label: "Growth", icon: "growth" },
] as const;
const accountLinks = [
  { href: "/brand", label: "Brand kit", icon: "brand" },
  { href: "/accounts", label: "Accounts", icon: "accounts" },
  { href: "/billing", label: "Billing", icon: "billing" },
  { href: "/settings", label: "Settings", icon: "settings" },
] as const;

export function AppShell({ children, workspaces, activeWorkspaceId, onWorkspaceChange, account, onSignOut, signOutDisabled, status, message }: AppShellProps) {
  const pathname = usePathname();
  // A path-bound disclosure also closes on browser Back/Forward navigation.
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;
  const panelId = useId();
  const desktopTrigger = useRef<HTMLButtonElement>(null);
  const mobileTrigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const close = () => setOpenAt(null);
  const active = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    if (!open) return;
    const currentPanel = panel.current;
    const trigger = window.matchMedia("(max-width: 860px)").matches ? mobileTrigger.current : desktopTrigger.current;
    const focusable = () => Array.from(currentPanel?.querySelectorAll<HTMLElement>('a[href], button:not(:disabled)') ?? []).filter((item) => item.getClientRects().length > 0);
    focusable()[0]?.focus();
    const dismiss = (event: PointerEvent) => {
      if (event.target instanceof Node && !currentPanel?.contains(event.target) && !desktopTrigger.current?.contains(event.target) && !mobileTrigger.current?.contains(event.target)) setOpenAt(null);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); setOpenAt(null); trigger?.focus(); }
      if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key) && currentPanel?.contains(document.activeElement)) {
        event.preventDefault();
        const items = focusable();
        const index = items.indexOf(document.activeElement as HTMLElement);
        const next = event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : (index + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
        items[next]?.focus();
      }
    };
    const onFocus = (event: FocusEvent) => {
      if (event.target instanceof Node && !currentPanel?.contains(event.target) && !desktopTrigger.current?.contains(event.target) && !mobileTrigger.current?.contains(event.target)) setOpenAt(null);
    };
    const onResize = () => setOpenAt(null);
    const breakpoint = window.matchMedia("(max-width: 860px)");
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", onKey);
    document.addEventListener("focusin", onFocus);
    breakpoint.addEventListener("change", onResize);
    return () => { document.removeEventListener("pointerdown", dismiss); document.removeEventListener("keydown", onKey); document.removeEventListener("focusin", onFocus); breakpoint.removeEventListener("change", onResize); };
  }, [open]);

  function navItem(item: { href: string; label: string; icon: IconName }, className = "rw-nav-item") {
    return <Link key={item.href} href={item.href} className={className} aria-current={active(item.href) ? "page" : undefined} onClick={close}><Icon name={item.icon} /><span>{item.label}</span></Link>;
  }

  return <div className="rw-shell">
    <a className="rw-skip" href="#main-content">Skip to content</a>
    <aside className="rw-sidebar" aria-label="Workspace navigation">
      <Link href="/dashboard" className="rw-wordmark" aria-label="Reelwise dashboard">Reel<span>wise</span></Link>
      <div className="rw-workspace"><label htmlFor="workspace">Workspace</label><select id="workspace" value={activeWorkspaceId ?? ""} disabled={!workspaces.length || status === "running"} onChange={(event) => onWorkspaceChange(event.target.value)}>
        {!activeWorkspaceId && <option value="">{status === "running" ? "Loading…" : "Select workspace"}</option>}
        {workspaces.map((workspace) => <option key={workspace.id} value={workspace.id}>{workspace.name}</option>)}
      </select></div>
      <nav aria-label="Main navigation" className="rw-desktop-nav">{primary.map((item) => navItem(item))}<p className="rw-nav-label">Grow</p>{grow.map((item) => navItem(item))}</nav>
      <div className="rw-account-area">
        <button ref={desktopTrigger} type="button" className="rw-account" aria-label={account ? `${account.name}, account menu` : "Account menu"} aria-expanded={open} aria-controls={panelId} onClick={() => setOpenAt(open ? null : pathname)}>
          <span className="rw-avatar" aria-hidden="true">{account?.initial ?? <Icon name="more" />}</span>
          <span className="rw-account-copy">{status === "running" ? <span className="rw-skeleton" /> : <><strong>{account?.name ?? "Account"}</strong><span>{account?.plan && account.creditsUsed !== undefined && account.creditsTotal !== undefined ? `${account.plan} · ${account.creditsUsed}/${account.creditsTotal} credits` : "Usage unavailable"}</span></>}</span>
        </button>
      </div>
    </aside>
    <div className="rw-main-column"><main id="main-content" className="rw-main" tabIndex={-1}>{status === "error" && <p role="alert" className="rw-error">{message ?? "Account details could not be loaded."}</p>}{children}</main></div>
    <nav className="rw-bottom-bar" aria-label="Mobile navigation">{primary.map((item) => navItem(item))}<button ref={mobileTrigger} className={`rw-nav-item${[...grow, ...accountLinks].some((item) => active(item.href)) ? " rw-more-active" : ""}`} type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setOpenAt(open ? null : pathname)}><Icon name="more" /><span>More</span></button></nav>
    {open && <div className="rw-account-menu" id={panelId} ref={panel} aria-label="Account and more navigation"><nav aria-label="Account navigation"><div className="rw-mobile-extra">{grow.map((item) => navItem(item, "rw-menu-item"))}</div>{accountLinks.map((item) => navItem(item, "rw-menu-item"))}<button className="rw-menu-item" type="button" disabled={signOutDisabled || status === "running"} onClick={() => { close(); void onSignOut(); }}><Icon name="logout" /><span>Log out</span></button></nav></div>}
  </div>;
}

import type { ScreenStateProps } from "@/types";

export function ScreenState({ title, status, message }: ScreenStateProps) {
  return <section aria-busy={status === "running"}><header className="rw-header"><h1>{title}</h1></header>{status === "running" ? <div role="status"><span className="sr-only">Loading {title}</span><div className="rw-loading-grid">{[0, 1, 2, 3].map((key) => <div className="rw-card" key={key}><span className="rw-skeleton rw-skeleton-block" /></div>)}</div></div> : <div className="rw-card"><p className={status === "error" ? "rw-error" : "rw-empty"} role={status === "error" ? "alert" : "status"}>{message ?? "Nothing to show yet."}</p></div>}</section>;
}

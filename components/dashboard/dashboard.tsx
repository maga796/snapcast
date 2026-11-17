"use client";

import Image from "next/image";
import { useId } from "react";
import { Button, Card, Meter, Tag } from "@/components/ui";
import type { DashboardProps } from "@/types";

const count = (value: number) => new Intl.NumberFormat("en-US").format(value);

export function Dashboard({ stats, viewsSeries, viewsByPlatform, videos, idea, status, steps, message, onCreateVideo, onMakeIdea }: DashboardProps) {
  const gradientId = useId();
  const loading = status === "running";
  const hasError = status === "error";
  const values = viewsSeries.map((value) => Number.isFinite(value) ? Math.max(0, value) : 0);
  const max = Math.max(1, ...values);
  const points = values.map((value, index) => `${values.length === 1 ? 300 : index / (values.length - 1) * 600},${130 - value / max * 120}`);
  const line = points.length ? `M${points.join(" L")}` : "";
  const platformMax = Math.max(1, ...viewsByPlatform.map((item) => item.views));
  const statsItems = [
    { label: "Views", value: stats?.views, change: stats?.viewsChange },
    { label: "Likes", value: stats?.likes },
    { label: "Clicks", value: stats?.clicks },
    { label: "Scheduled", value: stats?.scheduled },
  ];

  return <section aria-label="Dashboard" aria-busy={loading}>
    <header className="rw-header"><div><h1>Dashboard</h1><p className="rw-subtitle">Your videos and how they’re doing.</p></div><Button variant="primary" onClick={onCreateVideo}>Create a video</Button></header>
    {hasError && <p className="rw-error" role="alert">{message ?? "Dashboard could not be loaded."}</p>}
    {loading && <p className="sr-only" role="status">{message ?? "Loading dashboard…"}</p>}
    {steps && <ol aria-label="Progress" className="rw-progress-steps">{steps.map((step) => <li key={step.id}>{step.label}: {step.status}</li>)}</ol>}
    {idea && <Card className="rw-idea"><div><h2>This week’s idea</h2><p>{idea.description}</p></div><Button variant="primary" onClick={() => onMakeIdea(idea)}>Make it</Button></Card>}
    <dl className="rw-stats">{statsItems.map((stat) => <div key={stat.label} className="rw-card rw-stat"><dt>{stat.label}</dt><dd>{loading ? <span className="rw-skeleton" /> : hasError || stat.value === undefined ? <span aria-label="Not available">—</span> : count(stat.value)}</dd>{!loading && !hasError && stat.change && <dd className="rw-stat-change">{stat.change}</dd>}</div>)}</dl>
    <div className="rw-analytics"><Card><h2>Views, last 14 days</h2>{loading ? <div className="rw-chart rw-skeleton" /> : hasError ? <p className="rw-empty">Views unavailable.</p> : values.length ? <svg className="rw-chart" viewBox="0 0 600 146" preserveAspectRatio="none" role="img" aria-label={`Views, last 14 days: ${values.map(count).join(", ")}`}>
      <defs><linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--g)" stopOpacity=".3"/><stop offset="100%" stopColor="var(--g)" stopOpacity="0"/></linearGradient></defs>
      <path d={`${line} L${values.length === 1 ? 300 : 600},146 L${values.length === 1 ? 300 : 0},146 Z`} fill={`url(#${gradientId})`} />
      <path d={line} fill="none" stroke="var(--gi)" strokeWidth="2" vectorEffect="non-scaling-stroke" />{values.length === 1 && <circle cx="300" cy={130 - values[0] / max * 120} r="3" fill="var(--gi)" />}
    </svg> : <p className="rw-empty">No views yet.</p>}</Card>
    <Card><h2>Views by platform</h2>{loading ? <div className="rw-empty"><span className="rw-skeleton" /></div> : hasError ? <p className="rw-empty">Platform views unavailable.</p> : viewsByPlatform.length ? <ul className="rw-platforms">{viewsByPlatform.map((platform) => <li key={platform.id}><span className="rw-platform-label"><span className="rw-platform-dot" style={{ background: platform.color }} />{platform.name}</span><Meter label={`${platform.name} views`} value={platform.views} max={platformMax} /><span>{count(platform.views)}</span></li>)}</ul> : <p className="rw-empty">No platform views yet.</p>}</Card></div>
    <Card><h2>Your videos</h2>{loading ? <div className="rw-empty"><span className="rw-skeleton rw-skeleton-block" /></div> : hasError ? <p className="rw-empty">Videos unavailable.</p> : videos.length ? <table className="rw-table"><thead><tr><th scope="col"><span className="sr-only">Thumbnail</span></th><th scope="col">Video</th><th scope="col">Where</th><th scope="col">Views</th><th scope="col">Likes</th><th scope="col">Clicks</th></tr></thead><tbody>{videos.map((video) => <tr key={video.id}><td>{video.thumbnailUrl ? <Image src={video.thumbnailUrl} alt="" width={34} height={60} className="rw-video-thumbnail" unoptimized /> : <div className="rw-video-thumbnail" />}</td><td className="rw-table-title">{video.title}</td><td><div className="rw-table-tags">{video.platforms.map((platform) => <Tag key={platform.id} dotColor={platform.color}>{platform.name}</Tag>)}</div></td><td data-label="Views">{count(video.views)}</td><td data-label="Likes">{count(video.likes)}</td><td data-label="Clicks">{count(video.clicks)}</td></tr>)}</tbody></table> : <p className="rw-empty">No videos yet. Create a video to get started.</p>}</Card>
  </section>;
}

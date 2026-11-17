"use client";

import { useId, useState } from "react";
import type { FormatGalleryProps } from "@/types";
import "./format-gallery.css";

export function FormatGallery({ formats, categories, status, message, steps, onSelectFormat, onUseOwnRecording }: FormatGalleryProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const searchId = useId();
  const categoryOptions = [...new Set(categories)].filter((item) => item.trim() && item.toLowerCase() !== "all");
  const selectedCategory = category !== null && categoryOptions.includes(category) ? category : null;
  const query = search.trim().toLocaleLowerCase();
  const filtered = formats.filter((format) => (selectedCategory === null || format.category === selectedCategory) && format.name.toLocaleLowerCase().includes(query));
  const loading = status === "running";
  const failed = status === "error";

  return <section className="rw-formats" aria-labelledby="format-gallery-title" aria-busy={loading}>
    <header className="rw-header"><div><h1 id="format-gallery-title">Choose a format</h1><p className="rw-subtitle">Pick the kind of video you want for your app.</p></div></header>
    <label className="sr-only" htmlFor={searchId}>Search formats</label>
    <input className="rw-format-search" id={searchId} type="search" placeholder="Search formats" value={search} onChange={(event) => setSearch(event.target.value)} disabled={loading || failed} />
    <div className="rw-format-categories" role="group" aria-label="Format categories">
      <button type="button" aria-pressed={selectedCategory === null} onClick={() => setCategory(null)} disabled={loading || failed}>All</button>
      {categoryOptions.map((item) => <button type="button" key={item} aria-pressed={selectedCategory === item} onClick={() => setCategory(item)} disabled={loading || failed}>{item}</button>)}
    </div>
    {steps && <ol className="rw-format-steps" aria-label="Loading progress">{steps.map((step) => <li key={step.id}>{step.label}: {step.status}</li>)}</ol>}
    {loading ? <><p role="status" className="sr-only">{message ?? "Loading formats…"}</p><div className="rw-format-grid" aria-hidden="true">{Array.from({ length: 6 }, (_, index) => <div key={index} className="rw-format-skeleton"><span className="rw-format-art rw-skeleton" /><span className="rw-skeleton" /></div>)}</div></> : <>
      {failed ? <p role="alert" className="rw-error">{message ?? "Formats could not be loaded. Please try again later."}</p> : !filtered.length && <p role="status" className="rw-format-empty">{formats.length ? "No formats match your search." : "No formats available yet."}</p>}
      <div className="rw-format-grid">
        {!failed && filtered.map((format) => <button type="button" className="rw-format-card" key={format.id} onClick={() => onSelectFormat(format.id)}>
          <span className={`rw-format-art rw-format-art--${format.style}`} aria-hidden="true">
            {format.badge && <span className="rw-format-badge" data-tone={format.badge === "Rising" ? "rising" : format.badge === "Free to try" ? "free" : "default"}>{format.badge}</span>}
            <span className="rw-format-preview" />
          </span>
          <span className="rw-format-name">{format.name}</span>
          {format.badge && <span className="sr-only"> — {format.badge}</span>}
        </button>)}
        <button type="button" className="rw-format-card" onClick={onUseOwnRecording}><span className="rw-format-art rw-format-art--own" aria-hidden="true"><span>+</span></span><span className="rw-format-name">Use my own recording</span></button>
      </div>
      <p className="sr-only" role="status" aria-atomic="true">{!failed && filtered.length > 0 ? `${filtered.length} ${filtered.length === 1 ? "format" : "formats"} available` : ""}</p>
    </>}
  </section>;
}

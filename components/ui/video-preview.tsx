"use client";

import type { VideoPreviewProps } from "@/types";
import { Button, Meter } from "./primitives";
import { Icon } from "./icon";

const clamp = (value: number, max: number) => Number.isFinite(value) ? Math.max(0, Math.min(max, value)) : 0;

export function VideoPreview({ label, background, appCard, captions, currentTimeSeconds, durationSeconds, playing, cursor, status, message, onPlay, onPause }: VideoPreviewProps) {
  const duration = Number.isFinite(durationSeconds) ? Math.max(0, durationSeconds) : 0;
  const time = clamp(currentTimeSeconds, duration);
  const caption = captions.find((item) => time >= item.startSeconds && time < item.endSeconds);
  const unavailable = status === "running" || status === "error" || duration === 0;

  return <figure className="rw-preview" aria-label={label} aria-busy={status === "running"}>
    <div className="rw-preview-frame" style={{ background }}>
      {status === "running" ? <div className="rw-preview-message" role="status"><span className="rw-skeleton" />{message ?? "Loading preview…"}</div> : status === "error" ? <p className="rw-preview-message" role="alert">{message ?? "Preview could not be loaded."}</p> : duration === 0 ? <p className="rw-preview-message">{message ?? "No video to preview yet."}</p> : <>
        <div className="rw-preview-app">{appCard}</div>
        {cursor && <svg className="rw-preview-cursor" style={{ left: `${clamp(cursor.xPercent, 100)}%`, top: `${clamp(cursor.yPercent, 100)}%` }} viewBox="0 0 24 28" width="24" height="28" aria-hidden="true"><path d="M2 2v21l6-6 5 9 4-2-5-9h9Z" fill="white" stroke="#070c0a" strokeWidth="1.5" /></svg>}
        {caption && <p className="rw-preview-caption" key={caption.id}>{caption.text}</p>}
      </>}
      <div className="rw-preview-progress"><Meter label="Playback progress" value={time} max={duration} /></div>
    </div>
    <figcaption className="rw-preview-controls"><span>{label}</span><Button disabled={unavailable} aria-label={playing ? "Pause preview" : "Play preview"} onClick={playing ? onPause : onPlay}><Icon name={playing ? "pause" : "play"} />{playing ? "Pause" : "Play"}</Button></figcaption>
  </figure>;
}

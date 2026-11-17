"use client";

import { useEffect, useRef, useState } from "react";
import type { CaptionStyle, CreateValues, VideoFormat } from "@/types";
import { Button } from "@/components/ui";

interface Props {
  aspectRatio: CreateValues["aspectRatio"];
  onAspectRatioChange: (value: CreateValues["aspectRatio"]) => void;
  style: VideoFormat["style"];
  captionLook: CaptionStyle["look"];
  appName: string;
  durationSeconds: number;
  downloadAvailable: boolean;
  onDownload: () => void;
}

export function SetupPreview({ aspectRatio, onAspectRatioChange, style, captionLook, appName, durationSeconds, downloadAvailable, onDownload }: Props) {
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const elapsed = useRef(0);
  const duration = Number.isFinite(durationSeconds) && durationSeconds > 0 ? durationSeconds : 15;
  useEffect(() => {
    if (!playing) return;
    let frame: number;
    let previous: number | undefined;
    const tick = (now: number) => {
      if (previous !== undefined) elapsed.current = (elapsed.current + (now - previous) / 1000) % duration;
      previous = now;
      setTime(elapsed.current);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, duration]);
  const captions = ["MEET YOUR APP", appName ? `MEET ${appName.toUpperCase()}` : "SHIP FASTER WITH", "TRY IT TODAY"];
  const caption = captions[Math.min(2, Math.floor(time / duration * 3))];
  const stamp = (value: number) => `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, "0")}`;

  return <aside className="rw-setup-preview" aria-label="Video preview">
    <div className="rw-preview-ratios" role="group" aria-label="Preview size">{(["9:16", "1:1", "16:9"] as const).map((ratio) => <button type="button" key={ratio} aria-pressed={aspectRatio === ratio} onClick={() => onAspectRatioChange(ratio)}>{ratio}</button>)}</div>
    <div className={`rw-demo-phone rw-format-art--${style}`} style={{ aspectRatio: aspectRatio.replace(":", "/") }}>
      <span className="rw-demo-brand">Made with Reelwise</span>
      <div className="rw-demo-app" aria-hidden="true"><span /><strong>{appName}</strong><i /></div>
      <span className="rw-demo-cursor" aria-hidden="true" style={{ left: `${52 + Math.sin(time) * 12}%`, top: `${58 + Math.cos(time) * 6}%` }} />
      <p className={`rw-demo-caption rw-caption--${captionLook}`}>{captionLook === "word" ? caption.split(" ")[Math.floor(time * 2) % caption.split(" ").length] : caption}</p>
      <div className="rw-demo-progress" role="progressbar" aria-label="Preview playback" aria-valuemin={0} aria-valuemax={duration} aria-valuenow={Math.floor(time)}><span style={{ width: `${time / duration * 100}%` }} /></div>
    </div>
    <div className="rw-demo-controls"><Button onClick={() => setPlaying(!playing)} aria-label={playing ? "Pause preview" : "Play preview"}>{playing ? "Pause" : "Play"}</Button><span aria-label="Preview time">{stamp(time)} / {stamp(duration)}</span><Button onClick={onDownload} disabled={!downloadAvailable}>Download</Button></div>
  </aside>;
}

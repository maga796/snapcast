"use client";

import { useId, useRef, useState } from "react";
import type { CreateSetupProps, CreateValues, PostingDay, SetupOption } from "@/types";
import { Button } from "@/components/ui";
import { SetupPreview } from "./setup-preview";
import "./format-gallery.css";
import "./create-setup.css";

function Choices({ label, options, value, onChange, columns = 3 }: { label: string; options: readonly SetupOption[]; value: string; onChange: (id: string) => void; columns?: number }) {
  const name = useId();
  return <div className="rw-setup-options" style={{ "--option-columns": columns } as React.CSSProperties} role="group" aria-label={label}>{options.length ? options.map(option => <label className="rw-option" key={option.id}><input type="radio" name={name} value={option.id} checked={value === option.id} onChange={() => onChange(option.id)} /><span><strong>{option.name}</strong>{option.description && <small>{option.description}</small>}</span></label>) : <p className="rw-muted">No options available.</p>}</div>;
}

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const selected = (options: readonly SetupOption[], id: string) => options.some(option => option.id === id) ? id : options[0]?.id ?? "";

export function CreateSetup(props: CreateSetupProps) {
  const { format, goals, captionStyles, languages, voices, musicOptions, presenters, platforms, planPresets, creditsPerVideo, fetchStatus, fetchedDetails, createStatus, createSteps, onBack, onFetchLink, onUploadFiles, onPlayVoice, onDownload, onCreate, actionsAvailable = true, status = "idle" } = props;
  const prefix = useId();
  const urlInput = useRef<HTMLInputElement>(null);
  const [appUrl, setAppUrl] = useState("");
  const [name, setName] = useState<string | null>(null);
  const [featureText, setFeatureText] = useState<string | null>(null);
  const appName = name ?? fetchedDetails?.appName ?? "";
  const feature = featureText ?? fetchedDetails?.feature ?? "";
  const [style, setStyle] = useState(format.style);
  const [goalId, setGoalId] = useState("");
  const [captionId, setCaptionId] = useState("");
  const [languageId, setLanguageId] = useState("");
  const [voiceId, setVoiceId] = useState("");
  const [musicId, setMusicId] = useState("");
  const [presenterId, setPresenterId] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [delivery, setDelivery] = useState<"publish" | "files">("publish");
  const [platformIds, setPlatformIds] = useState<string[]>([]);
  const defaultPreset = planPresets.find(preset => preset.id === "weekdays") ?? planPresets[0];
  const [postingDays, setPostingDays] = useState<PostingDay[]>(() => [...(defaultPreset?.days ?? [])]);
  const [postsPerDay, setPostsPerDay] = useState(defaultPreset?.postsPerDay ?? 1);
  const [aspectRatio, setAspectRatio] = useState<CreateValues["aspectRatio"]>("9:16");
  const [validation, setValidation] = useState("");
  const busy = createStatus === "running";
  const weekly = postingDays.length * postsPerDay;
  const monthlyCredits = creditsPerVideo !== null && Number.isFinite(creditsPerVideo) && creditsPerVideo >= 0 ? Math.ceil(weekly * creditsPerVideo * 4) : null;
  const validPlatforms = platformIds.filter(id => platforms.some(platform => platform.id === id && platform.connected));
  const caption = captionStyles.find(option => option.id === selected(captionStyles, captionId));

  function fetchLink() {
    if (!urlInput.current?.reportValidity()) return;
    try { const url = new URL(appUrl); if (!["https:", "http:"].includes(url.protocol)) throw new Error(); onFetchLink(url.href); }
    catch { setValidation("Enter a valid http or https app link."); }
  }

  return <section className="rw-setup" aria-busy={status === "running"}>
    <Button className="rw-all-formats" onClick={onBack}>← All formats</Button>
    <header className="rw-header"><div><h1>{format.name}</h1><p className="rw-subtitle">Set up your series and preview it.</p></div></header>
    {status === "running" ? <div className="rw-setup-grid" role="status"><span className="sr-only">Loading setup…</span><div className="rw-card"><div className="rw-skeleton rw-setup-skeleton" /></div><div className="rw-skeleton rw-setup-skeleton" /></div> : status === "error" ? <p className="rw-error" role="alert">{props.message ?? "Setup could not be loaded."}</p> : <div className="rw-setup-grid">
      <form className="rw-card rw-setup-form" onSubmit={event => {
        event.preventDefault();
        if (!actionsAvailable || busy || fetchStatus === "running") return;
        if (!appName.trim() || !feature.trim()) { setValidation("Enter your app name and feature."); return; }
        if (!postingDays.length) { setValidation("Choose at least one posting day."); return; }
        if (delivery === "publish" && !validPlatforms.length) { setValidation("Select a connected platform or choose Send me the files."); return; }
        setValidation("");
        onCreate({ formatId: format.id, appUrl, appName: appName.trim(), feature: feature.trim(), style, goalId: selected(goals, goalId), files, captionStyleId: selected(captionStyles, captionId), languageId: selected(languages, languageId), voiceId: selected(voices, voiceId), musicId: selected(musicOptions, musicId), presenterId: selected(presenters, presenterId), delivery, platformIds: delivery === "publish" ? validPlatforms : [], days: [...postingDays].sort(), postsPerDay, aspectRatio });
      }}>
        <fieldset className="rw-setup-fields" disabled={busy}>
          <div className="rw-setup-basics">
            <label htmlFor={`${prefix}-url`}>App link</label><div className="rw-fetch-row"><input ref={urlInput} id={`${prefix}-url`} type="url" placeholder="https://yourapp.com" value={appUrl} onChange={event => setAppUrl(event.target.value)} /><Button variant="primary" status={fetchStatus} disabled={!appUrl.trim() || !actionsAvailable} onClick={fetchLink}>{fetchStatus === "running" ? "Fetching…" : "Fetch"}</Button></div>
            <p className="rw-field-hint">Paste your link and we’ll pull your logo, colors, copy, and screenshots.</p>
            {fetchStatus === "error" && <p className="rw-error" role="alert">{props.fetchMessage ?? "Could not fetch app details."}</p>}
            {fetchStatus === "running" && <p role="status" className="rw-field-hint">{props.fetchMessage ?? "Fetching app details…"}</p>}
            {fetchStatus === "done" && <p role="status" className="rw-field-hint">{props.fetchMessage ?? "App details received."}</p>}
            <label htmlFor={`${prefix}-name`}>App name</label><input id={`${prefix}-name`} required placeholder="Example: Taskly" value={appName} onChange={event => setName(event.target.value)} />
            <label htmlFor={`${prefix}-feature`}>{format.id === "changelog-update" ? "Release notes (paste your changelog)" : "Feature to highlight"}</label><textarea id={`${prefix}-feature`} required rows={2} placeholder="Example: Turn emails into tasks in one click" value={feature} onChange={event => setFeatureText(event.target.value)} />
            <label htmlFor={`${prefix}-style`}>Style</label><select id={`${prefix}-style`} value={style} onChange={event => setStyle(event.target.value as CreateValues["style"])}><option value="clean">Clean</option><option value="bold">Bold</option><option value="dark">Dark</option></select>
          </div>
          <section className="rw-setup-section"><h2>Goal</h2><p>Where should viewers go?</p><Choices label="Goal" options={goals} value={selected(goals, goalId)} onChange={setGoalId} /></section>
          <section className="rw-setup-section"><h2>Your app media</h2><p>Screenshots or recordings to use in the video.</p><div className="rw-upload"><div><strong>Add screenshots or recordings</strong><small>Images or videos of your app</small></div><label className="rw-button rw-upload-button">Browse<input aria-label="Add screenshots or recordings" type="file" accept="image/*,video/*" multiple onChange={event => { const next = Array.from(event.target.files ?? []); if (next.length) { setFiles(next); onUploadFiles(next); } }} /></label></div>{files.length > 0 && <p role="status">{files.length} {files.length === 1 ? "file selected" : "files selected"}</p>}</section>
          <section className="rw-setup-section"><h2>Caption look</h2><p>How captions appear in your video.</p><div className="rw-caption-options" role="group" aria-label="Caption look">{captionStyles.map(option => <label className="rw-option" key={option.id}><input type="radio" name={`${prefix}-caption`} aria-label={option.name} checked={selected(captionStyles, captionId) === option.id} onChange={() => setCaptionId(option.id)} /><span><span className={`rw-caption-sample rw-caption--${option.look}`}>{option.look === "marker" ? <><span>Ship</span><mark>faster</mark><span>with</span></> : option.look === "word" ? "SHIP" : option.look === "pop" ? "faster" : "SHIP FASTER WITH"}</span><strong>{option.name}</strong></span></label>)}</div>{!captionStyles.length && <p>No caption styles available.</p>}</section>
          <section className="rw-setup-section"><h2>Voice</h2><p>Pick a language and a narrator.</p><div className="rw-setup-chips" role="group" aria-label="Language">{languages.map(language => <button type="button" key={language.id} aria-pressed={selected(languages, languageId) === language.id} onClick={() => setLanguageId(language.id)}>{language.name}</button>)}</div><div className="rw-voice-list">{voices.map(voice => <div className="rw-voice-row" key={voice.id} data-selected={selected(voices, voiceId) === voice.id}><label><input type="radio" name={`${prefix}-voice`} aria-label={voice.name} checked={selected(voices, voiceId) === voice.id} onChange={() => setVoiceId(voice.id)} /><span><strong>{voice.name} {voice.pro && <span className="rw-pro-voice">Pro voice</span>}</strong>{voice.description && <small>{voice.description}</small>}</span></label><Button disabled={!actionsAvailable} aria-label={`Play ${voice.name}`} onClick={() => onPlayVoice(voice.id)}>Play</Button><span className="rw-radio-dot" aria-hidden="true" /></div>)}</div>{!voices.length && <p>No voices available.</p>}</section>
          <section className="rw-setup-section"><label htmlFor={`${prefix}-music`}>Music</label><p>Pick a track. Check each platform’s rules before using trending sounds.</p><select id={`${prefix}-music`} value={selected(musicOptions, musicId)} onChange={event => setMusicId(event.target.value)} disabled={!musicOptions.length}>{!musicOptions.length && <option value="">No music available</option>}{musicOptions.map(option => <option key={option.id} value={option.id}>{option.name}</option>)}</select></section>
          <section className="rw-setup-section"><h2>AI presenter</h2><p>Add a talking presenter so you don’t have to appear on camera.</p><Choices label="AI presenter" options={presenters} value={selected(presenters, presenterId)} onChange={setPresenterId} columns={4} /></section>
          <section className="rw-setup-section"><h2>Where it goes</h2><p>How do you want to receive your videos?</p><Choices label="Delivery" options={[{ id: "publish", name: "Publish for me" }, { id: "files", name: "Send me the files" }]} value={delivery} onChange={id => setDelivery(id as "publish" | "files")} columns={2} />{delivery === "publish" && <><p className="rw-platform-prompt">Choose where to publish</p><div className="rw-setup-options rw-platform-options" role="group" aria-label="Publishing platforms">{platforms.map(platform => <label className="rw-option" key={platform.id}><input type="checkbox" checked={validPlatforms.includes(platform.id)} disabled={!platform.connected} onChange={() => setPlatformIds(ids => ids.includes(platform.id) ? ids.filter(id => id !== platform.id) : [...ids, platform.id])} /><span><strong>{platform.name}</strong><small>{platform.connected ? platform.description ?? "Connected" : "Not connected"}</small></span></label>)}</div>{!platforms.length && <p>No platforms available.</p>}</>}</section>
          <section className="rw-setup-section"><h2>Your posting plan</h2><p>Pick a pace, then adjust the days.</p><div className="rw-setup-chips" role="group" aria-label="Posting presets">{planPresets.map(preset => <button type="button" key={preset.id} aria-pressed={postsPerDay === preset.postsPerDay && postingDays.length === preset.days.length && preset.days.every(day => postingDays.includes(day))} onClick={() => { setPostingDays([...preset.days]); setPostsPerDay(preset.postsPerDay); }}>{preset.name}</button>)}</div><div className="rw-posting-days" role="group" aria-label="Posting days">{days.map((day, index) => <button type="button" key={day} aria-label={day} aria-pressed={postingDays.includes(index as PostingDay)} onClick={() => setPostingDays(current => current.includes(index as PostingDay) ? current.filter(value => value !== index) : [...current, index as PostingDay])}>{day[0]}</button>)}</div><p className="rw-weekly-count">{weekly} {weekly === 1 ? "video" : "videos"} a week</p><p className="rw-weekly-hint">Posted on the days you pick</p></section>
          {validation && <p role="alert" className="rw-error">{validation}</p>}
          {createStatus === "error" && <p role="alert" className="rw-error">{props.createMessage ?? "Could not create your videos. Please try again."}</p>}
          {createSteps && <ol className="rw-create-steps" aria-label="Creation progress">{createSteps.map(step => <li key={step.id} data-status={step.status}>{step.label}<span>{step.status}</span></li>)}</ol>}
          {(busy || createStatus === "done") && <p role="status" className="rw-field-hint">{props.createMessage ?? (busy ? "Creating your videos…" : "Your videos are ready.")}</p>}
          <Button type="submit" variant="primary" status={createStatus} disabled={!actionsAvailable || fetchStatus === "running"}>{busy ? "Creating…" : "Create my videos"}</Button><p className="rw-field-hint rw-credit-hint">{monthlyCredits === null ? "Credits estimate unavailable" : `About ${monthlyCredits} credits a month at this pace`}</p>
        </fieldset>
      </form>
      <SetupPreview aspectRatio={aspectRatio} onAspectRatioChange={setAspectRatio} style={style} captionLook={caption?.look ?? "plain"} appName={appName} durationSeconds={props.previewDurationSeconds ?? 15} downloadAvailable={props.downloadAvailable ?? false} onDownload={onDownload} />
    </div>}
  </section>;
}

"use client";

import { useId } from "react";
import type { ReactElement } from "react";
import type { Campaign, CampaignOption, CampaignsProps, PreflightCheck } from "@/types";
import { checkCampaign } from "@/lib/campaigns";
import { Button } from "@/components/ui";

interface EditorProps { campaign: Campaign; screen: CampaignsProps }
interface SelectProps {
  label: string; value: string; options: readonly CampaignOption[];
  onChange: (value: string) => void;
}

function CampaignSelect(props: SelectProps): ReactElement {
  const id: string = useId();
  let hasValue: boolean = false;
  for (const option of props.options) {
    if (option.id === props.value) hasValue = true;
  }
  return <label htmlFor={id}>{props.label}<select id={id} value={props.value} disabled={props.options.length === 0}
    onChange={event => props.onChange(event.target.value)}>
    {!hasValue && <option value={props.value}>{props.value === "" ? "Select an option" : "Unavailable option"}</option>}
    {props.options.map(option => <option key={option.id} value={option.id}>{option.name}</option>)}
  </select></label>;
}

export function CampaignEditor(props: EditorProps): ReactElement {
  const campaign: Campaign = props.campaign;
  const screen: CampaignsProps = props.screen;
  const prefix: string = useId();
  const checks: PreflightCheck[] = checkCampaign(campaign.script, campaign.caption, campaign.underThirtySeconds);
  let checksPass: boolean = true;
  for (const check of checks) {
    if (!check.passed) checksPass = false;
  }
  let blockReason: string = "";
  if (campaign.paused) blockReason = "Resume the campaign first.";
  else if (!checksPass) blockReason = "Fix the preflight checks first.";
  else if (screen.actionsAvailable === false) blockReason = "Scheduling is unavailable until the backend is connected.";
  const busy: boolean = campaign.approveStatus === "running" || campaign.approvalRequestStatus === "running" || campaign.regenerateStatus === "running" || campaign.pauseStatus === "running";
  const failed: boolean = campaign.approveStatus === "error" || campaign.approvalRequestStatus === "error" || campaign.regenerateStatus === "error" || campaign.pauseStatus === "error";
  const activeStep: number = campaign.stage === "Approved" ? 4 : campaign.stage === "Ready" ? 3 : 1;
  return <>
    <section className="rw-card campaign-status">
      <div><div><h2>Next ad goes out{campaign.nextAdTime ? ` ${campaign.nextAdTime}` : " — not scheduled"}</h2>
        <p className="campaign-hint">{campaign.message ?? "Review it and approve before then."}</p></div>
        <span className="campaign-tag" data-stage={campaign.stage}>{campaign.stage}</span></div>
      <ol className="campaign-steps" aria-label="Ad progress">{["Script", "Variants", "Review", "Publish"].map((step, index) =>
        <li key={step} aria-current={index + 1 === activeStep ? "step" : undefined}>{index + 1}. {step}</li>)}
      </ol>
    </section>
    <div className="campaign-editor-grid">
      <fieldset className="rw-card campaign-fields" disabled={busy}>
        <label htmlFor={`${prefix}-script`}>Script <span>{campaign.script.length.toLocaleString("en-US")} / 1,500</span></label>
        <textarea id={`${prefix}-script`} value={campaign.script} maxLength={1500}
          onChange={event => screen.onChange(campaign.id, { script: event.target.value })} />
        <Button className="campaign-regenerate" disabled={screen.actionsAvailable === false}
          onClick={() => screen.onRegenerateScript(campaign.id)}>{campaign.regenerateStatus === "running" ? "Writing…" : "Write a new script"}</Button>
        <h3>Hook (first 3 seconds)</h3>
        <div className="campaign-hooks" role="group" aria-label="Hook options">
          {screen.hooks.map(hook => <button type="button" key={hook.id} aria-pressed={campaign.hookId === hook.id}
            onClick={() => screen.onChange(campaign.id, { hookId: hook.id })}>
            <strong>{hook.label}: {hook.text}</strong><small>Predicted hold: {hook.predictedHold ?? "Unavailable"}</small>
          </button>)}
        </div>
        {screen.hooks.length === 0 && <p className="campaign-hint">No hook options available.</p>}
        <label htmlFor={`${prefix}-caption`}>Caption</label>
        <input id={`${prefix}-caption`} value={campaign.caption} onChange={event => screen.onChange(campaign.id, { caption: event.target.value })} />
        <div className="campaign-selects">
          <CampaignSelect label="Background" value={campaign.backgroundId} options={screen.options.backgrounds} onChange={value => screen.onChange(campaign.id, { backgroundId: value })} />
          <CampaignSelect label="Voice" value={campaign.voiceId} options={screen.options.voices} onChange={value => screen.onChange(campaign.id, { voiceId: value })} />
          <CampaignSelect label="Font" value={campaign.fontId} options={screen.options.fonts} onChange={value => screen.onChange(campaign.id, { fontId: value })} />
        </div>
        <div className="campaign-switches">
          <label><input type="checkbox" role="switch" checked={campaign.backgroundMusic} onChange={event => screen.onChange(campaign.id, { backgroundMusic: event.target.checked })} /><span className="campaign-switch-track" />Background music</label>
          <label><input type="checkbox" role="switch" checked={campaign.underThirtySeconds} onChange={event => screen.onChange(campaign.id, { underThirtySeconds: event.target.checked })} /><span className="campaign-switch-track" />Under 30 seconds</label>
        </div>
      </fieldset>
      <div className="campaign-preview-column">
        <div className="rw-card campaign-preview-card"><figure className="campaign-preview" aria-label="Ad preview">
          <span className="campaign-watermark">Made with Reelwise</span>
          <div className="campaign-mock-app" aria-hidden="true"><span /><i /></div>
          <span className="campaign-cursor" aria-hidden="true" />
          <figcaption>{campaign.previewCaption ?? campaign.caption}</figcaption>
          <div className="campaign-preview-progress" aria-hidden="true" />
        </figure></div>
        <section className="rw-card campaign-preflight"><h2>Preflight checks</h2>
          <ul aria-live="polite">{checks.map(check => <li key={check.id}><span className="campaign-check" data-pass={check.passed} aria-label={check.passed ? "Pass" : "Fail"}>{check.passed ? "✓" : "!"}</span>{check.label}</li>)}</ul>
        </section>
      </div>
    </div>
    <div className="campaign-actions">
      <div><Button variant="primary" disabled={blockReason !== "" || busy}
        aria-describedby={blockReason ? `${prefix}-blocked` : undefined}
        onClick={() => { if (blockReason === "" && !busy) screen.onApprove(campaign.id); }}>
        {campaign.approveStatus === "running" ? "Scheduling…" : "Approve and schedule"}</Button>
      <Button disabled={busy || screen.actionsAvailable === false}
        onClick={() => screen.onRequestClientApproval(campaign.id)}>{campaign.approvalRequestStatus === "running" ? "Sending…" : "Send for client approval"}</Button></div>
      {campaign.credits !== undefined && <p className="campaign-hint">{campaign.credits} credits</p>}
      {blockReason && <p id={`${prefix}-blocked`} className="campaign-hint" role="status">{blockReason}</p>}
      {failed && <p role="alert" className="rw-error">{campaign.actionMessage ?? "The action failed. Please try again."}</p>}
      {!failed && campaign.actionMessage && <p role="status">{campaign.actionMessage}</p>}
    </div>
  </>;
}

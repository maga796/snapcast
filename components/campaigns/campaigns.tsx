"use client";

import { useId, useRef, useState } from "react";
import type { KeyboardEvent, ReactElement } from "react";
import type { Campaign, CampaignPatch, CampaignsProps } from "@/types";
import { weeklyAds } from "@/lib/campaigns";
import { Button } from "@/components/ui";
import { CampaignEditor } from "./campaign-editor";
import { CampaignSchedule } from "./campaign-schedule";
import "./campaigns.css";

interface DetailProps { campaign: Campaign; screen: CampaignsProps }

function CampaignDetail(props: DetailProps): ReactElement {
  const [tab, setTab] = useState<"next" | "schedule">("next");
  const [sourceCampaign, setSourceCampaign] = useState<Campaign>(props.campaign);
  const [draft, setDraft] = useState<CampaignPatch>({});
  const prefix: string = useId();
  const nextTab = useRef<HTMLButtonElement>(null);
  const scheduleTab = useRef<HTMLButtonElement>(null);
  // Backend records supersede unsaved form values; operation states stay prop-driven.
  if (sourceCampaign !== props.campaign) {
    setSourceCampaign(props.campaign);
    setDraft({});
  }
  const campaign: Campaign = Object.assign({}, props.campaign, draft);
  function changeCampaign(campaignId: string, patch: CampaignPatch): void {
    setDraft(currentDraft => Object.assign({}, currentDraft, patch));
    props.screen.onChange(campaignId, patch);
  }
  const screen: CampaignsProps = Object.assign({}, props.screen, { onChange: changeCampaign });
  function moveTab(event: KeyboardEvent<HTMLDivElement>): void {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const showSchedule: boolean = event.key === "End" || (event.key !== "Home" && tab === "next");
    setTab(showSchedule ? "schedule" : "next");
    if (showSchedule) scheduleTab.current?.focus();
    else nextTab.current?.focus();
  }
  return <div className="campaign-detail">
    <div className="campaign-toolbar">
      <div className="campaign-tabs" role="tablist" aria-label="Campaign view" onKeyDown={moveTab}>
        <button ref={nextTab} type="button" role="tab" id={`${prefix}-next`} aria-controls={`${prefix}-panel`}
          aria-selected={tab === "next"} tabIndex={tab === "next" ? 0 : -1} onClick={() => setTab("next")}>Next ad</button>
        <button ref={scheduleTab} type="button" role="tab" id={`${prefix}-schedule`} aria-controls={`${prefix}-panel`}
          aria-selected={tab === "schedule"} tabIndex={tab === "schedule" ? 0 : -1} onClick={() => setTab("schedule")}>Schedule</button>
      </div>
      <Button status={campaign.pauseStatus} disabled={screen.actionsAvailable === false}
        onClick={() => screen.onTogglePause(campaign.id)}>{campaign.pauseStatus === "running" ? "Updating…" : campaign.paused ? "Resume campaign" : "Pause campaign"}</Button>
    </div>
    <div role="tabpanel" id={`${prefix}-panel`} aria-labelledby={`${prefix}-${tab}`} tabIndex={0}>
      {tab === "next" ? <CampaignEditor campaign={campaign} screen={screen} /> : <CampaignSchedule campaign={campaign} screen={screen} />}
    </div>
  </div>;
}

export function CampaignsLoading(): ReactElement {
  return <div className="campaign-layout" role="status" aria-label="Loading campaigns"><div className="rw-skeleton campaign-list-skeleton" />
    <div className="campaign-loading"><div className="rw-skeleton campaign-status-skeleton" /><div className="rw-skeleton campaign-editor-skeleton" /></div>
  </div>;
}

export function Campaigns(props: CampaignsProps): ReactElement {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  let selectedCampaign: Campaign | undefined = props.campaigns[0];
  for (const campaign of props.campaigns) {
    if (campaign.id === selectedId) selectedCampaign = campaign;
  }
  return <section className="campaigns" aria-busy={props.status === "running"}>
    <header className="rw-header"><div><h1>Campaigns</h1><p className="rw-subtitle">Ad series that keep producing. Review every ad before it goes out.</p></div>
      <Button variant="primary" onClick={props.onNewCampaign}>New campaign</Button>
    </header>
    {props.status === "running" ? <CampaignsLoading /> : props.status === "error" ?
      <p role="alert" className="rw-error">{props.message ?? "Campaigns could not be loaded. Please try again later."}</p> : selectedCampaign === undefined ?
      <div className="rw-card campaign-empty"><h2>No campaigns yet</h2><p className="campaign-hint">Create a campaign to start planning your ads.</p></div> :
      <div className="campaign-layout">
        <div className="campaign-list" role="group" aria-label="Campaigns">
          {props.campaigns.map(campaign => <button type="button" key={campaign.id} className="campaign-list-card"
            aria-pressed={selectedCampaign?.id === campaign.id} onClick={() => setSelectedId(campaign.id)}>
            <strong>{campaign.name}</strong><span>{campaign.paused ? "Paused" : "Active"} · {weeklyAds(campaign.cadence)} a week</span>
          </button>)}
        </div>
        <CampaignDetail key={selectedCampaign.id} campaign={selectedCampaign} screen={props} />
      </div>}
  </section>;
}

"use client";

import type { ReactElement } from "react";
import type { Campaign, CampaignCadence, CampaignMonth, CampaignsProps } from "@/types";
import { buildCampaignMonth } from "@/lib/campaigns";
import { Button } from "@/components/ui";

interface ScheduleProps { campaign: Campaign; screen: CampaignsProps }
const presets: readonly { id: CampaignCadence; label: string }[] = [
  { id: "twice-weekly", label: "Twice a week" }, { id: "weekdays", label: "Weekdays" },
  { id: "daily", label: "Every day" }, { id: "twice-daily", label: "Twice a day" },
];

export function CampaignSchedule(props: ScheduleProps): ReactElement {
  const campaign: Campaign = props.campaign;
  const screen: CampaignsProps = props.screen;
  const calendar: CampaignMonth | null = buildCampaignMonth(screen.month, screen.today, campaign.cadence, campaign.skippedDates);
  const cells: ReactElement[] = [];
  if (calendar !== null) {
    for (let offset: number = 0; offset < calendar.offset; offset += 1) {
      cells.push(<span key={`offset-${offset}`} aria-hidden="true" />);
    }
    for (const day of calendar.days) {
      let actionLabel: string = "No ad scheduled";
      if (day.scheduled) actionLabel = day.skipped ? "Add ad back" : "Skip ad";
      cells.push(<button key={day.date} type="button" className="campaign-day"
        data-scheduled={day.scheduled} data-skipped={day.skipped} data-today={day.today}
        aria-label={`${day.label}: ${actionLabel}`} aria-pressed={day.scheduled && !day.skipped}
        aria-current={day.today ? "date" : undefined} aria-disabled={!day.scheduled}
        onClick={() => { if (day.scheduled) screen.onToggleSkipDate(campaign.id, day.date); }}>{day.day}</button>);
    }
  }
  return <div className="campaign-schedule">
    <section className="rw-card"><h2>Connected platforms</h2>
      <div className="campaign-platforms">
        {screen.platforms.map(platform => <div className="campaign-platform" key={platform.id}>
          <div><strong><span className="campaign-dot" style={{ backgroundColor: platform.color }} />{platform.name}</strong>
            <Button status={platform.status} disabled={screen.actionsAvailable === false}
              aria-label={`${platform.connected ? "Disconnect" : "Connect"} ${platform.name}`}
              onClick={() => screen.onConnectPlatform(platform.id, !platform.connected)}>
              {platform.status === "running" ? "Updating…" : platform.connected ? "Disconnect" : "Connect"}
            </Button>
          </div>
          <p>{platform.connected ? platform.accountLabel ? `Connected as ${platform.accountLabel}` : "Connected" : "Not connected"}</p>
          {platform.status === "error" && <p className="rw-error" role="alert">{platform.message ?? "Connection could not be updated."}</p>}
        </div>)}
      </div>
      {screen.platforms.length === 0 && <p className="campaign-hint">No platforms available.</p>}
    </section>
    <section className="rw-card">
      {calendar === null ? <p role="alert">Calendar unavailable. Supply a valid month and today date.</p> : <>
        <h2>{calendar.title}</h2><p className="campaign-hint">Green days get an ad. Select a day to skip it or add it back.</p>
        <div className="campaign-presets" role="group" aria-label="Posting cadence">
          {presets.map(preset => <button type="button" key={preset.id} aria-pressed={campaign.cadence === preset.id}
            onClick={() => screen.onChange(campaign.id, { cadence: preset.id })}>{preset.label}</button>)}
        </div>
        <div className="campaign-weekdays" aria-hidden="true">{["S", "M", "T", "W", "T", "F", "S"].map((day, index) => <span key={index}>{day}</span>)}</div>
        <div className="campaign-calendar" role="group" aria-label={calendar.title}>{cells}</div>
        <p className="campaign-hint" role="status">{calendar.plannedAds} {calendar.plannedAds === 1 ? "ad" : "ads"} planned this month.</p>
      </>}
    </section>
  </div>;
}

import type { CampaignCadence, CampaignDay, CampaignMonth, PreflightCheck } from "@/types/campaigns";

export function checkCampaign(script: string, caption: string, underThirtySeconds: boolean): PreflightCheck[] {
  const trimmedScript: string = script.trim();
  const wordCount: number = trimmedScript === "" ? 0 : trimmedScript.split(/\s+/u).length;
  const wordLimit: number = underThirtySeconds ? 75 : 150;
  return [
    { id: "script", label: "Script has a hook and a body", passed: wordCount >= 15 },
    { id: "cta", label: "Call to action included", passed: /\b(try|start|free|get)\b/iu.test(script) },
    { id: "duration", label: `Fits under ${underThirtySeconds ? "30" : "60"} seconds (about ${wordCount} words)`, passed: wordCount <= wordLimit },
    { id: "caption", label: "Caption is set and under 150 characters", passed: caption.trim().length > 0 && caption.length <= 150 },
  ];
}

export function cadenceMatches(cadence: CampaignCadence, weekday: number): boolean {
  if (cadence === "twice-weekly") return weekday === 1 || weekday === 4;
  if (cadence === "weekdays") return weekday >= 1 && weekday <= 5;
  return true;
}

export function weeklyAds(cadence: CampaignCadence): number {
  if (cadence === "twice-weekly") return 2;
  if (cadence === "weekdays") return 5;
  if (cadence === "twice-daily") return 14;
  return 7;
}

export function buildCampaignMonth(month: string, today: string, cadence: CampaignCadence, skippedDates: readonly string[]): CampaignMonth | null {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/u.test(month)) return null;
  if (!/^\d{4}-(0[1-9]|1[0-2])-([012]\d|3[01])$/u.test(today)) return null;
  const todayDate: Date = new Date(`${today}T00:00:00Z`);
  if (!Number.isFinite(todayDate.getTime()) || todayDate.toISOString().slice(0, 10) !== today) return null;
  const firstDate: Date = new Date(`${month}-01T00:00:00Z`);
  const lastDate: Date = new Date(firstDate);
  lastDate.setUTCMonth(lastDate.getUTCMonth() + 1, 0);
  const days: CampaignDay[] = [];
  let plannedAds: number = 0;
  const dateFormatter: Intl.DateTimeFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "full", timeZone: "UTC" });
  for (let day: number = 1; day <= lastDate.getUTCDate(); day += 1) {
    const date: string = `${month}-${String(day).padStart(2, "0")}`;
    const calendarDate: Date = new Date(`${date}T00:00:00Z`);
    const scheduled: boolean = date >= today && cadenceMatches(cadence, calendarDate.getUTCDay());
    const skipped: boolean = skippedDates.includes(date);
    if (scheduled && !skipped) plannedAds += cadence === "twice-daily" ? 2 : 1;
    days.push({ date: date, day: day, label: dateFormatter.format(calendarDate), scheduled: scheduled, skipped: skipped, today: date === today });
  }
  return {
    title: new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(firstDate),
    offset: firstDate.getUTCDay(), days: days, plannedAds: plannedAds,
  };
}

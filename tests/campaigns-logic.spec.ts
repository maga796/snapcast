import { expect, test } from "@playwright/test";
import { buildCampaignMonth, checkCampaign } from "../lib/campaigns";

test("preflight validates word-count boundaries, whole-word CTA, and captions", () => {
  expect(checkCampaign("try ".repeat(14), "Caption", true)[0].passed).toBe(false);
  expect(checkCampaign("try ".repeat(15), "Caption", true)[0].passed).toBe(true);
  expect(checkCampaign("try ".repeat(75), "Caption", true)[2].passed).toBe(true);
  expect(checkCampaign("try ".repeat(76), "Caption", true)[2].passed).toBe(false);
  expect(checkCampaign("try ".repeat(150), "Caption", false)[2].passed).toBe(true);
  expect(checkCampaign("try ".repeat(151), "Caption", false)[2].passed).toBe(false);
  expect(checkCampaign("forget restart entry carefree", "Caption", true)[1].passed).toBe(false);
  expect(checkCampaign("TRY!", "Caption", true)[1].passed).toBe(true);
  expect(checkCampaign("Try", " ", true)[3].passed).toBe(false);
  expect(checkCampaign("Try", "a".repeat(150), true)[3].passed).toBe(true);
  expect(checkCampaign("Try", "a".repeat(151), true)[3].passed).toBe(false);
});

test("calendar handles cadence, skips, leap years, and invalid dates", () => {
  expect(buildCampaignMonth("2026-11", "2026-11-14", "weekdays", [])?.plannedAds).toBe(11);
  expect(buildCampaignMonth("2026-11", "2026-11-14", "weekdays", ["2026-11-16"])?.plannedAds).toBe(10);
  expect(buildCampaignMonth("2026-11", "2026-11-14", "twice-daily", [])?.plannedAds).toBe(34);
  expect(buildCampaignMonth("2026-11", "2026-11-14", "twice-daily", ["2026-11-14"])?.plannedAds).toBe(32);
  expect(buildCampaignMonth("2026-11", "2026-11-14", "twice-weekly", [])?.plannedAds).toBe(5);
  expect(buildCampaignMonth("2028-02", "2028-02-01", "daily", [])?.days).toHaveLength(29);
  expect(buildCampaignMonth("2026-02", "2026-02-01", "daily", [])?.days).toHaveLength(28);
  expect(buildCampaignMonth("2026-11", "2026-12-01", "daily", [])?.plannedAds).toBe(0);
  expect(buildCampaignMonth("2026-13", "2026-11-14", "daily", [])).toBeNull();
  expect(buildCampaignMonth("2026-11", "2026-02-30", "daily", [])).toBeNull();
});

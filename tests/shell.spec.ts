import { expect, test } from "@playwright/test";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());
test.skip(Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY), "The signed-out shell fixture is only available without Clerk credentials; auth.spec.ts covers the configured app.");

test("desktop navigation and accessible account disclosure", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/dashboard");
  const sidebar = page.getByRole("complementary", { name: "Workspace navigation" });
  await expect(sidebar).toBeVisible();
  await expect(sidebar.getByRole("link", { name: "Dashboard", exact: true })).toHaveAttribute("aria-current", "page");
  expect((await sidebar.boundingBox())?.width).toBe(208);
  const trigger = page.getByRole("button", { name: "Account menu", exact: true });
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  const brand = page.getByRole("link", { name: "Brand kit", exact: true });
  await expect(brand).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("link", { name: "Accounts", exact: true })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.click();
  await page.mouse.click(700, 400);
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await page.screenshot({ path: "artifacts/shell-desktop.png" });
  await trigger.click();
  await page.screenshot({ path: "artifacts/shell-account-menu.png" });
});

test("mobile More sheet, navigation, and no horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/dashboard");
  await expect(page.getByRole("complementary")).toBeHidden();
  const more = page.getByRole("button", { name: "More", exact: true });
  await expect(more).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(375);
  await page.screenshot({ path: "artifacts/shell-mobile.png" });
  await more.click();
  await expect(page.getByRole("link", { name: "Calendar", exact: true }).last()).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(375);
  await page.screenshot({ path: "artifacts/shell-mobile-more.png" });
  await page.getByRole("link", { name: "Inbox", exact: true }).last().click();
  await expect(page).toHaveURL(/\/inbox$/, { timeout: 30_000 });
  await expect(more).toHaveAttribute("aria-expanded", "false");
  await more.click();
  await page.keyboard.press("Escape");
  await expect(more).toBeFocused();
});

test("navigation changes at the specified breakpoint", async ({ page }) => {
  await page.goto("/dashboard");
  await page.setViewportSize({ width: 861, height: 800 });
  await expect(page.getByRole("complementary")).toBeVisible();
  await page.setViewportSize({ width: 860, height: 800 });
  await expect(page.getByRole("complementary")).toBeHidden();
  await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible();
});

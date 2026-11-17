import { expect, test } from "@playwright/test";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());
test.skip(!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY, "Requires local Clerk credentials.");

test("protected routes redirect signed-out visitors to local sign-in", async ({ page }) => {
  for (const route of ["/dashboard", "/campaigns", "/settings"]) {
    await page.goto(route);
    await expect(page).toHaveURL(/\/sign-in(?:[/?]|$)/, { timeout: 30_000 });
    await expect(page.locator(".cl-signIn-root")).toBeVisible({ timeout: 30_000 });
    await expect(page.getByRole("heading", { name: "Sign-in unavailable" })).toHaveCount(0);
  }
});

test("local auth forms load and fit a mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/sign-in");
  await expect(page.locator(".cl-signIn-root")).toBeVisible({ timeout: 30_000 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(375);
  await page.goto("/sign-up");
  await expect(page.locator(".cl-signUp-root")).toBeVisible({ timeout: 30_000 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(375);
});

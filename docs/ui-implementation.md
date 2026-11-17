# Reelwise UI

## Connection points

- `components/shell/app-shell.tsx`: presentational shell; workspace, account, status, and handlers come from props. All public prop types are exported from `types/index.ts`.
- `components/shell/shell-connection.tsx`: client adapter for Clerk sign-out and backend placeholders. Replace the marked empty workspace/account props when connecting your backend.
- `components/dashboard/dashboard.tsx`: dashboard with optional idea, stat cards, SVG chart, platform bars, video table, and loading/error/empty states.
- `components/dashboard/dashboard-connection.tsx`: client navigation handlers. Server pages pass serializable values; ordinary function props cannot cross a server-to-client boundary.
- `components/ui`: Card, Button, Chip, Tag, Switch, Meter, Toast, VideoPreview, Icon, and screen states.
- VideoPreview consumes playback time, playing state, timed captions, cursor position, gradient, and app-card content. The caller advances playback; the component does not simulate it or invoke providers.
- The eleven other routes are titled empty placeholders with loading boundaries, ready for their own screen implementations.

## Authentication

This checkout originally had neither Clerk nor credentials. The SDK, provider, proxy, real `signOut` handler, and page-level guards are now installed. Copy `.env.example` to `.env.local`, fill in the two Clerk keys, then restart the server. Production builds need those variables too.

When credentials are absent, the shell remains visible but protected page content is withheld. No authentication bypass or invented identity is provided. Sign-out is disabled until configured.

With Clerk configured, `/sign-in` and `/sign-up` host Clerk's real forms. Signed-out protected routes redirect to `/sign-in`, successful authentication falls back to `/dashboard`, and sign-out returns to `/sign-in`. Already-signed-in visitors to either auth page return to the dashboard. The sidebar reads the name and initial from Clerk; plan and credits still await backend data. The supplied local credentials have been verified by loading both forms and checking signed-out redirects. Completing an actual sign-in/sign-out session requires the user's authentication challenge and has not been automated.

Official setup references checked: [Clerk Next.js](https://clerk.com/docs/nextjs/getting-started/quickstart), [page protection](https://clerk.com/docs/nextjs/guides/secure/protect-content), and [sign-out](https://clerk.com/docs/guides/development/custom-flows/authentication/sign-out). Next.js conventions were checked against the installed `next/dist/docs` guides.

## Visual review

Sources: the prompt's dimensions and `design/1-new-sidebar-desktop.png`, `2-account-menu-open.png`, `5-mobile-bottom-bar.png`, and `6-mobile-more-menu.png`. `prototype.css` and the HTML prototype are not in this checkout. Unspecified styling was reconstructed from the screenshots following the user's clarification; exact source-CSS parity cannot be verified.

Review sizes: 1280 × 800 and 375 × 800; breakpoint checks also cover 860 and 861 pixels.

Observed issues corrected:

- The existing wildcard Tailwind loader discarded the workspace styles. Restricting it to `globals.css` preserves the ordinary stylesheet and font CSS.
- Desktop Create button sat above the reference position; aligned it to the header bottom and corrected its height.
- GROW and the second navigation group were four pixels too low; corrected the label margin.
- Missing account text wrapped and enlarged the footer; constrained it to two single lines with ellipsis.
- Empty analytics panels collapsed; kept their desktop/mobile heights stable.
- Menu rows were two pixels too tall; reduced vertical padding to achieve 39px rows.

Intentional visible differences from populated reference screenshots:

- Sora is used as requested; the supplied references use a fallback font, so glyph shapes and text widths differ.
- There is no sample workspace, initial, name, plan, or credit balance. Empty labels replace those records until props are supplied.
- The sample-data chip and prototype disclaimer are omitted. Removing the disclaimer makes the account popover and More sheet shorter, with their bottom anchoring preserved.
- Dashboard placeholder props omit the optional idea and contain no numbers, chart points, platform bars, or table rows. Empty states replace them and move later panels upward. Populated-state pixel parity has not been verified with real data.
- Without Clerk keys, real routes show a sign-in-unavailable state instead of protected dashboard content. Dashboard visuals were inspected using a temporary empty-props harness, removed after review.
- The controls absent from these four references (including the video preview) have matching shared styling, but exact reference parity is not established for them.

Browser captures are saved under ignored `artifacts/`. The dashboard captures were made with the temporary harness; its URL did not activate the Dashboard nav item. The actual `/dashboard` route's active item is verified by the browser test.

## Checks

`npm run typecheck`, `npm run lint`, `npm run build`, and `npm run test:ui`.

Browser tests cover the sidebar width, active navigation, menu opening, Escape, outside click, arrow-key focus movement, focus restoration, mobile navigation, the exact breakpoint, and absence of horizontal overflow at 375px. On Windows they use installed Edge; on other systems install Playwright Chromium first. Shell-only tests run without credentials; configured environments instead run auth-form, protected-redirect, and mobile auth-layout tests. No test submits credentials or creates a user.

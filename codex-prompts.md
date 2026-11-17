# Reelwise: Codex prompts for every screen

Framework: **Next.js** (App Router, TypeScript, Tailwind CSS) with **Clerk**. The landing page and login already exist.

## Before you start
1. Unzip `reelwise-reference-v2.zip` into your project root. You get a `reference/` folder:
   - `reelwise-v2.html`: the working prototype (source for text and behavior)
   - `prototype.css`: every color, size, and spacing value
   - `screens/`: a screenshot of every screen (desktop and phone)
2. Ask Codex: "List the files in reference/ and confirm you can read prototype.css."
3. Paste the prompts below one at a time, in order. After each one, compare the result with the named screenshot.

Screenshots use a fallback font because Sora could not load where they were taken. The prototype itself uses Sora.

---

## Step 0: rules (paste first; save as AGENTS.md if Codex supports it)
```
We are building the Reelwise web app inside this existing Next.js project (App Router, TypeScript, Tailwind CSS, Clerk already set up, landing page already built).

SOURCE OF TRUTH
reference/reelwise-v2.html is an exact working prototype. reference/prototype.css holds every visual value. reference/screens/ has a screenshot of every screen. The new app must look and behave the same.
- Copy all text exactly as written in the reference.
- Use the exact values from prototype.css: colors, font sizes, spacing, radii, shadows, gradients, breakpoints. Translate them into Tailwind or CSS without changing how they look. Do not estimate values from screenshots.
- Dark theme only. Font: Sora via next/font.
- When a step names a function (for example rDash), read that function in the reference file to match its behavior.

DATA
No backend yet. Use hardcoded sample data in /lib/sample-data.ts and one client-side store (React Context or Zustand) for videos, campaigns, connected accounts, plan, credits, brand kit, and workspace. Everything simulated in the prototype stays simulated. Do not add Supabase, payments, or real API calls in these steps.

ROUTES (inside one route group with a shared layout, all protected by Clerk)
/dashboard, /create, /campaigns, /library, /publish, /calendar, /inbox, /growth, /brand, /accounts, /billing, /settings. Replace the existing /dashboard placeholder.

RULES
- Before writing any Next.js or Clerk code, check the current official docs. Do not rely on memory for APIs, file names, or versions.
- Do not invent text, numbers, testimonials, or features that are not in the reference.
- Accessible: semantic HTML, visible focus states, labeled controls, keyboard operable.
- After every step: compare your result with the named screenshot at 1280px and 375px wide, list every visible difference, and fix them before finishing.
- No sideways scrolling at 375px on any page. The project must build with no TypeScript or lint errors.
```

## Step 1: Design tokens and app shell
```
Reference: screens/01-dashboard.png, 15-account-menu-open.png, 16-mobile-dashboard.png, 17-mobile-more-menu.png, prototype.css, and the nav, account menu, and icon code (IC, ico, toggleMenu, acctCard) in reference/reelwise-v2.html.

Build:
1. globals.css with the same CSS variables as prototype.css (--bg, --sf, --sf2, --line, --ink, --mut, --g, --gi) and the soft green glow behind the page.
2. The shared layout. Desktop: a 208px left sidebar with the Reelwise wordmark, a Workspace select (Taskly, Acme Studio (client), Northwind (client)), then the nav: Dashboard, Create, Campaigns, Library, Publish; a small "GROW" label; Calendar, Inbox, Growth. Every item has an 18px line icon (stroke 1.8, rounded, same shapes as the IC object in the reference; lucide-react equivalents are fine only if they look the same). The active item has a dark green-tinted background and green text.
3. At the bottom of the sidebar, an account button (green circle with "A", "Alex", and "Free · 32/100 credits", which updates from the store). Clicking it opens a popover above it with Brand kit, Accounts, Billing, Settings, Log out (Clerk sign out), and the note "Prototype: nothing is rendered or posted, and stats are sample data." Close on outside click and on Escape. Use aria-expanded.
4. At 860px wide or less: the sidebar becomes a fixed bottom bar with five items (Dashboard, Create, Campaigns, Library, Publish) plus "More", each with the icon above a small label. "More" opens a sheet above the bar listing Calendar, Inbox, Growth, Brand kit, Accounts, Billing, Settings, and Log out. The workspace select and account button are hidden on mobile.
5. Main area: 28px padding, max width 1080px. Make sure wide content never causes sideways scrolling (min-width 0 on the main grid item).
6. Shared components matching the reference: Card, Button (default and primary with green glow), Chip, Tag, Switch, Meter, Toast, and the video preview "Phone" (9:16 frame, gradient background, mock app card, moving cursor, three cycling captions, progress bar, Pause/Play).
Create all 12 routes as empty pages with titles for now.
```

## Step 2: Dashboard
```
Build the Dashboard page. Match screens/01-dashboard.png, the rDash and addIdea functions, and prototype.css exactly.
Contents: title "Dashboard", subtitle "Your videos and how they're doing." with a "Sample data" tag, and a primary "Create a video" button. A "This week's idea" card with a "Make it" button (opens Create with Dev Log selected). Four stat cards (Views, Likes, Clicks, Scheduled; Views shows "+18% vs last 14 days"). A "Views, last 14 days" SVG area chart using [820,950,900,1200,1500,1380,1700,2100,1950,2400,2800,2600,3100,3400]. A "Views by platform" bar list (YouTube, TikTok, Instagram, Meta). A "Your videos" table (thumbnail, title, platform tags, views, likes, clicks).
Sample videos (views/likes/clicks): Taskly launch teaser (YouTube 4200/260/90, TikTok 9600/610/210, Instagram 3100/190/60), Feature walkthrough (YouTube 2800/170/55, Instagram 2400/150/48), Founder story (TikTok 5100/330/102, Meta 1500/90/30). Totals are computed from the store.
```

## Step 3: Create, format gallery
```
Build the format gallery at the start of the Create page. Match screens/02-create-gallery.png and the rFmt function exactly.
Title "Choose a format", a search input, category chips (All, Demos, Launches, Tutorials, Stories, Social proof), and a card grid. Cards: Product Demo (Demos, Top pick), Feature drop (Demos, Top pick), Launch Teaser (Launches, Rising), Founder Story (Stories, Top pick), 60-second how-to (Tutorials, Free to try), Before & After (Demos, Rising), Changelog Update (Launches, Free to try), Customer story (Social proof, Free to try), Dev Log (Stories, Rising), Pricing explained (Demos, no badge), Pain to fix (Launches, Top pick), plus a dashed "Use my own recording" card that shows a "not active yet" toast. Card backgrounds cycle through the clean, bold, and dark gradients. Search and category filtering work together. Clicking a card opens the setup screen.
```

## Step 4: Create, setup screen
```
Build the setup screen that opens after choosing a format. Match screens/03-create-setup.png and the rSet, schedUpd, fetchLink, and generate logic in the reference exactly.
Layout: a "← All formats" back button, the format name as the title, and a left form card with a sticky video preview on the right. Sections in this order: App link with a "Fetch" button (simulated: fills the app name and a starter feature line), App name, Feature to highlight, Style select (Clean, Bold, Dark), Goal (Website link, App store page, Link in bio), Your app media (file input, shows a file count only), Caption look (Plain, Marker, One word at a time, Pop, each with a small preview), Voice (language chips English, Spanish, French, Portuguese, German; narrators Marcus, Ava, Jordan, Elias and Nora, the last two tagged "Pro voice", each with a Play button that shows a "not active yet" toast), Music (No music, Upbeat, Cinematic, Lo-fi, Trending sounds (TikTok)), AI presenter (None, Maya, Leo, Sam), Where it goes ("Publish for me" or "Send me the files", with platform cards that follow connected accounts), Your posting plan (preset chips Twice a week, Weekdays, Every day, Twice a day plus seven tappable day buttons and a "N videos a week" label), and a "Create my videos" button with "About N credits a month at this pace" (N = videos per week x 8).
Preview: 9:16 frame with mock app card, moving cursor, three cycling captions, progress bar, 9:16 / 1:1 / 16:9 switch, Pause/Play, a 0:00 / 0:15 counter, and a Download button (toast: not active yet). Caption look changes the preview text style. The Changelog Update format relabels the feature field "Release notes (paste your changelog)" and adds an "Import latest release from GitHub" button. Creating shows four progress steps (Capturing screenshots, Writing captions, Adding motion and music, Rendering), then adds the video to the store and adds 8 to credits used.
```

## Step 5: Campaigns (two tabs)
```
Build the Campaigns page. Match screens/04-campaigns-next-ad.png, 05-campaigns-schedule.png, 18-mobile-campaigns.png, and the rCamp, pre, and rPF functions exactly. Read the SCR, ALT, HKS, OPT, KEY, and camps arrays in the reference for sample data.

Layout: title "Campaigns", subtitle "Ad series that keep producing. Review every ad before it goes out.", and a "New campaign" button (opens Create). Left column: campaign cards (name, "Active/Paused · N a week") with the selected one outlined in green. Right column: a "Next ad / Schedule" tab switch and a Pause campaign / Resume campaign button.

Next ad tab:
- Status card: "Next ad goes out today at 6:00 PM", a status tag (Draft, Ready, Approved), a message, and a 4-step tracker (1. Script, 2. Variants, 3. Review, 4. Publish). Draft highlights step 1, Ready step 3, Approved step 4.
- Left card: Script textarea with a "N / 1,500" counter, a "Write a new script" button (cycles three alternate scripts and resets status to Draft), Hook options A, B, C with "Predicted hold: 72%, 81%, 66% (sample)", Caption input, three selects (Background: Screenshots, Screen recording, Abstract; Voice: Marcus, Ava, Jordan; Font: Sora Bold, Inter Bold, Poppins Bold), and two switches (Background music, Under 30 seconds).
- Right: the 9:16 preview card and a "Preflight checks" card with four live checks: script has at least 15 words; call to action present (the script contains try, start, free, or get); fits under 30 seconds (75 words or fewer, or 150 if the switch is off); caption set and 150 characters or fewer. Failing checks show an amber "!" and passing checks a green check.
- Buttons: "Approve and schedule" (toast "Resume the campaign first." if paused; "Fix the preflight checks first." if any check fails; otherwise status Approved and a toast), "Send for client approval" (status Ready, toast "Approval link sent (simulated)"), and "8 credits" below. Editing the script sets the status back to Draft.

Schedule tab:
- "Connected platforms": four cards with a colored dot, status, and Connect/Disconnect.
- "November 2026" calendar: preset chips (Twice a week, Weekdays, Every day, Twice a day) and a 7-column grid. From the 14th on, days matching the cadence are green. Select a day to skip it (dimmed, struck through) or add it back, by click or Enter/Space. Today (the 14th) has an outline. A line reads "N ads planned this month." Days must be keyboard focusable with an aria-label.
```

## Step 6: Library
```
Build the Library page. Match screens/06-library.png and the rLib function exactly.
Title "Library" with a "Create a video" button. Two cards: "Auto-clip a long demo" (Upload recording button, then three suggested clips Hook moment 0:12, Feature reveal 1:40, Call to action 3:05, each with "Create short" that adds a video) and "Screen recorder" (button shows a "not active yet" toast). Then a search box and a list of videos with thumbnail, title (inline rename), platforms or "Draft", an export-size select, and buttons Export, Rename/Save, Duplicate, Share/Unshare (toast with a share link, and an "In public gallery" label), Delete. Empty state: "No videos found."
```

## Step 7: Publish
```
Build the Publish page. Match screens/07-publish.png and the rPub, addAi, and addHT functions exactly.
Left card: Video select; Platforms list (YouTube Shorts, TikTok, Instagram Reels, Facebook Reels, each with a switch if connected or a Connect button if not, plus the video's status); Caption textarea with "Write with AI" (three hook suggestions that fill the caption), an "Add a tracking link" checkbox with the tracking link line, "Test 3 hooks" (A 38%, B 51%, C 44% with "Use winner (B)"), and "Also publish dubbed versions" chips (Spanish, French, Portuguese, German); When: Now or Schedule (date-time input) with the hint "Best times for your audience: Tue and Thu, 6 PM (sample)."; and a "Publish to N platforms" button, disabled as "Pick a platform" until one is selected. Right: the video preview. Publishing sets each platform's status to Published or Scheduled, shows a toast, and goes to the Dashboard. Empty state: "No videos yet".
```

## Step 8: Calendar
```
Build the Calendar page. Match screens/08-calendar.png and the rCal function exactly.
November 2026 grid (the 1st is a Sunday). Today is the 14th and is highlighted. S M T W T F S headers and a "Sample data" tag. Published videos on day 3 (Launch teaser), 6 (Feature walkthrough), and 10 (Founder story) in green. Scheduled videos from the store start on day 14 and go every 2 days, in amber. Scheduled videos can be dragged to another day, or clicked and then a day clicked (future days only, otherwise toast "Pick a future day."). Toast "Rescheduled to Nov N". Grid columns use minmax(0, 1fr) so the page never scrolls sideways on phones.
```

## Step 9: Inbox
```
Build the Inbox page. Match screens/09-inbox.png and the rInbox function exactly.
Title "Inbox", subtitle "Comments from every platform in one place." with a "Sample data" tag. One card with four comments, each with a colored platform dot: Dana on YouTube "Does this work with Notion?", Ravi on TikTok "The link in your bio isn't working for me", Mia on Instagram "Love the captions. What tool made this?", Tom on Meta "Is there a free plan?". Each has a reply input, a "Suggest" button (fills a polite reply), and a "Send" button (requires text, toast "Reply sent (simulated)", then shows "Replied: ...").
```

## Step 10: Growth
```
Build the Growth page. Match screens/10-growth.png and the rGrowth function exactly.
Sections: "Signups from videos" table (Video, Clicks, Signups = clicks x 0.12 rounded) with a "Copy tracking snippet" button; "Launch checklist" with a progress meter and "N of 9 done", three groups (Product Hunt, Reddit, X) of three checkboxes (Prepare gallery images and a tagline, Schedule your teaser and launch-day videos, Reply to every comment in the first 3 hours); "Trend alerts" (Dev Log, Before & After, Changelog Update, each with a "Make this" button that opens that format in Create); "Competitor watch" (link input, Watch button, adds a card with sample stats); "Landing page for {brand}" with "Generate outline"; and "Share Reelwise" with a "Copy badge code" button.
```

## Step 11: Brand
```
Build the Brand kit page. Match screens/11-brand.png and the rBrand function exactly.
Left card: Brand name, Brand color (color input), Font select (Sora, Inter, Poppins, Space Grotesk), Logo (letter tile plus an Upload button with a "not active yet" toast), Plan (Free adds a "Made with Reelwise" watermark; Pro removes it), and a "Save brand kit" button. Right card: a live preview using the 9:16 preview component. Saving updates the --bk color used in previews. Switching plan toggles the watermark everywhere.
```

## Step 12: Accounts
```
Build the Accounts page. Match screens/12-accounts.png and the rAcc and addInt functions exactly.
A card of platforms (YouTube, TikTok, Instagram, Meta) with colored dots and Connect/Disconnect buttons (YouTube and Instagram start connected as @yourapp; TikTok and Meta show "Planned after launch"). Disconnecting removes the platform from any selected platforms. Then an "Integrations" card (GitHub, Stripe, Product Hunt, Zapier, each with a description and Connect/Disconnect; Product Hunt shows a "Launch kit" button with a sample tagline, gallery, and thread; Stripe shows a "Milestone video" button with a "not active yet" toast). Then a "Weekly report email" card with a switch and a Preview button that shows a sample email.
```

## Step 13: Billing
```
Build the Billing page. Match screens/13-billing.png and the rBill function exactly.
"Credits this month" meter (used of 100, 1,000, or 5,000 depending on plan, "Resets Dec 1."), three plan cards (Free $0 "1 workspace, watermark, 100 credits a month"; Pro $19 "No watermark, 1,000 credits, all platforms"; Studio $49 "Client workspaces, team seats, 5,000 credits") with the note "Prices are placeholders", a switch button on each (Free turns the watermark on), an Invoices card (none on Free; Nov 1, 2026 and Oct 1, 2026 marked Paid on paid plans), and a "Refer a friend" card with the link reelwise.com/r/yourapp and a "Copy link" button.
```

## Step 14: Settings
```
Build the Settings page. Match screens/14-settings.png and the rSettings function exactly.
Cards: Profile (Name "Alex", Email "alex@yourapp.com", Save); Team (You as Owner, Sam as Viewer, role selects, invite by email with validation); Notifications (switches for Video finished rendering, New comments, Weekly report); API access (a "Generate API key" button that shows a masked sample key); Delete account (the button only responds after typing DELETE, and deletes nothing).
```

## Step 15: Onboarding overlay
```
Build the first-run onboarding overlay. Match screens/00-onboarding.png and the rOb function exactly.
A centered dialog on a dark backdrop with three steps: 1) "Paste your app's link" with an input, 2) "Pick a format" with Product Demo, Launch Teaser, and Founder Story, 3) "See your first video". Buttons: Next / "Show my video", and Skip. Finishing opens Create with the chosen format and, if a link was entered, runs Fetch. Show it once per session. It must trap focus and be keyboard operable.
```

## Step 16: Workspaces and final check
```
Build the workspace switcher behavior (swaps the brand kit and videos between Taskly and the two client workspaces; Taskly has the sample data, the others start empty). Then compare every route against its screenshot at 1280px and 375px wide and list the differences. Fix them. Also check: keyboard navigation on every screen, no console errors, no sideways scrolling at 375px, and a clean build. Do not add anything that is not in the reference.
```

# Implementation Plan

Build v1 in eight milestones, starting with a complete path from uploaded assets to a downloadable ad. Add browser capture and social publishing once that path is reliable.

The release remains an invite-only, free beta for approximately 100 users. Payments stay in v2.

## 1. Validate the deployment and rendering foundations

Use Next.js App Router on Cloudflare Workers through OpenNext, with separate Trigger.dev workers for media processing.

Before building the full interface, verify:

- Clerk Google/email-code authentication works in a deployed Cloudflare preview.
- Clerk identities correctly enforce ownership in Supabase.
- A Trigger.dev task renders a 30-second Remotion composition with FFmpeg.
- The result uploads to ImageKit and plays through authorized, expiring links.
- Browserbase supports manual login, explicit screenshot capture, and session cleanup with recording disabled.

Use the current security-patched Next.js 16 release supported by OpenNext, then pin compatible dependency versions. At the time of planning, Next.js lists 16 as Active LTS; OpenNext's Node middleware/proxy support needs particular attention. Run deployment checks in Linux CI because OpenNext documents limited Windows support. Recheck compatibility when implementation begins.

References: [Next.js support policy](https://nextjs.org/support-policy), [OpenNext compatibility](https://opennext.js.org/cloudflare).

**Completion condition:** authentication, private data access, rendering, and media delivery work together in deployed environments. Record render time, memory use, and cost.

## 2. Establish the application, ownership model, and beta controls

Build the public landing page, waitlist, invitation redemption, sign-in, dashboard, and account settings. Use faceless.video as the visual reference, with an original interface tailored to software advertising.

### Recommended routes

| Route | Purpose |
|---|---|
| `/` and `/waitlist` | Public introduction and beta registration |
| `/sign-in`, `/sign-up`, `/invite/[token]` | Authentication and invitations |
| `/app` | Recent projects, progress, allowance, scheduled posts |
| `/app/products/[id]` | Product profile and reusable assets |
| `/app/create` | Guided creation flow |
| `/app/projects/[id]` | Scripts, variants, feedback, downloads |
| `/app/calendar` | Scheduled and published posts |
| `/app/connections` | Connected social accounts |
| `/app/settings` | Profile, usage, timezone, deletion |
| `/admin` | Founder operations and authorized support |

Use Clerk for identity and Supabase for application records and access policies. Supabase supports Clerk session tokens through its third-party authentication integration.

Reference: [Supabase and Clerk integration](https://supabase.com/docs/guides/auth/third-party/clerk).

### Proposed data structure

| Records | Important relationships and fields |
|---|---|
| Users, invitations, waitlist | Unique Clerk ID; invitation expiry and redemption |
| Products | Owner, name, audience, URL, branding, archive status |
| Assets | Owner/product, storage ID, media type, size, duration, processing status |
| Projects and script revisions | Product, brief, template, format, duration, approved revision |
| Generation runs and variants | Input snapshot, status, provider references, output asset, cost |
| Allowance ledger | Monthly allocation, reservations, consumption, releases, admin grants |
| Social connections and posts | Owner, destination, credentials reference, variant, schedule, status, external ID |
| Metric snapshots | Post, measurement time, supported metrics |
| Support grants and audit events | Authorized scope, expiry, actor, action |

Enforce ownership in server operations and database policies. Invitation redemption, allowance reservations, and webhook processing must tolerate duplicate requests.

**Completion condition:** two test users cannot access each other's records, media, jobs, or social connections.

## 3. Build products, uploads, and the guided creation flow

Implement:

**Product and assets → brief and template → script review → generation → results.**

Upload directly to ImageKit using narrowly scoped authorization, avoiding large file transfers through the web server. Verify the actual file type, dimensions, duration, and size before making an asset usable.

Start with three distinct templates that support all three aspect ratios. Preserve software-screen readability through deliberate framing, zooming, and safe text areas.

Save drafts on the server so users can resume after navigation or an expired session. Include upload progress, recoverable failures, empty states, and clear field validation.

For original-audio mode, show the proposed recording excerpts before approval. If the speech cannot fit the selected duration coherently, request different excerpts or offer AI narration.

**Completion condition:** a user can create a product, upload assets, select a template, and resume a saved draft.

## 4. Implement script generation, AI media, and rendering

Use these recommended providers initially:

| Responsibility | Provider |
|---|---|
| Scripts and structured scene descriptions | Claude |
| Supporting images and video clips | fal |
| Voiceover and transcription/timing | ElevenLabs |
| Completion emails | Resend |
| Interactive remote browser | Browserbase |

Exact model IDs should be selected through a small quality-and-cost benchmark, then pinned.

References: [Claude structured output](https://platform.claude.com/docs/en/build-with-claude/structured-outputs), [fal media generation](https://fal.ai/docs/documentation/model-apis/overview), [ElevenLabs speech timing](https://elevenlabs.io/docs/api-reference/text-to-speech/convert-with-timestamps), [Resend email](https://resend.com/docs/send-with-nextjs).

### Generation workflow

1. Validate assets, available allowance, and the approved script revision.
2. Reserve allowance atomically and create a durable generation request.
3. Generate a shared scene structure with three different hooks.
4. Produce required supporting media, narration, and captions.
5. Render each variant independently.
6. Validate and store each finished video.
7. Settle allowance usage and send the completion notification.

AI should produce validated scene descriptions consumed by predefined templates. It should never supply executable rendering code.

Reuse approved assets and unchanged scenes across variants. When feedback changes one hook, regenerate only the affected material.

Trigger.dev supports FFmpeg build extensions; the complete Remotion worker configuration still needs the milestone-one benchmark.

Reference: [Trigger.dev FFmpeg documentation](https://trigger.dev/docs/config/extensions/ffmpeg).

**Completion condition:** three usable variants render from an approved script; a failed variant does not discard successful results or consume allowance permanently.

## 5. Add temporary browser capture

Embed an interactive remote browser controlled by the user. Provide explicit Capture and End Session actions.

Each session must:

- Belong to one authenticated user.
- Have a short timeout and concurrency limit.
- Disable session recording and persistent login contexts.
- Avoid retaining credentials or sensitive browser logs.
- Restrict access to internal infrastructure and unsafe network destinations.
- Save only explicitly captured screenshots.
- End on user request, timeout, or account cleanup.

Browserbase documents interactive Live View and disabling recordings. Provider logs and retention require separate verification.

References: [Browserbase Live View](https://docs.browserbase.com/platform/browser/observability/session-live-view), [Browserbase recording controls](https://docs.browserbase.com/platform/browser/observability/session-replay).

Keep file upload available when a website rejects remote login.

**Completion condition:** a tester can capture an authenticated product screen, approve it, and use it in an ad without retaining their browser session.

## 6. Add publishing, scheduling, and metrics

Begin developer-account setup and platform review preparation during the early milestones. Implement each platform behind a common interface for connection, publishing, status checks, and metrics.

The user reviews a finished variant, destination, caption, required disclosures, and posting time before approval.

Store one publishing record per destination. Keep the selected video revision fixed: regenerating a project must not silently replace an already scheduled video.

For scheduling:

- Display the user's timezone; store timestamps in UTC.
- Recheck cancellation, credentials, and media availability before publishing.
- Retry temporary failures within the agreed 30-minute window.
- Reconcile uncertain outcomes before another attempt.
- Notify users when reconnection or rescheduling is required.

Refresh metrics periodically. Show unsupported or unavailable metrics distinctly from zero.

Release each integration when it passes its own checks. Instagram professional-account requirements and TikTok's public-posting audit remain external dependencies.

References: [Instagram publishing](https://developers.facebook.com/documentation/instagram-platform/content-publishing), [TikTok requirements](https://developers.tiktok.com/docs/en/content-sharing-guidelines).

**Completion condition:** approved integrations publish and schedule reliably, with accurate status and no blind duplicate retries.

## 7. Complete founder controls and lifecycle management

Add invitation management, allowance adjustments, account suspension, failed-job inspection, and cost visibility.

Support access should be explicit, scoped to the requested project, time-limited, revocable, and audited.

Deletion should first prevent new work, then cancel pending jobs/posts and clean up stored media. Workers must check deletion state before writing outputs or publishing.

**ASSUMPTION:** deleting an account removes application data and connections but does not automatically delete posts already published on external platforms. Explain this before confirmation.

Use Sentry plus structured job logs carrying project/run identifiers. Track generation success, completion time, cost per finished video, publishing failures, and allowance discrepancies. Keep scripts, credentials, and raw media out of routine logs.

**Completion condition:** the founder can operate the beta and resolve failures without routine direct database edits.

## 8. Test and release progressively

Maintain separate local, staging, and production credentials and data. CI should run type checks, linting, meaningful tests, and the Cloudflare deployment build.

Prioritize tests for:

- Cross-account access and media authorization.
- Concurrent generation requests and allowance accounting.
- Duplicate callbacks, retries, and partial batch failures.
- Scheduled-post cancellation and uncertain publishing outcomes.
- Deletion while jobs are running.
- Caption timing, readable text, aspect-ratio framing, and playable exports.
- Expired sessions and interrupted uploads.

Use representative screenshots and recordings from several kinds of software. Measure the under-10-minute target under realistic concurrency.

Expand invitations gradually toward 100 testers after checking quality, failures, and costs.

**Completion condition:** the complete creation/download flow passes, enabled publishing integrations pass, and remaining restrictions are clearly visible.

## Provisional operating defaults

These are provisional operating defaults, not cost estimates.

| Limit | Starting proposal |
|---|---|
| Monthly allowance | One three-video batch plus three individual regenerations; no rollover |
| Active generation | One batch per user |
| Image uploads | Up to 10 MB each |
| Recording uploads | Up to 100 MB and three minutes each |
| Storage | 500 MB per tester, including outputs |
| Browser sessions | One active session per user; ten-minute maximum |
| Export | MP4, H.264/AAC, 30 fps, format-appropriate 1080-class dimensions |
| Background music | Optional, from a small verified commercial-use library |

These limits require validation against the selected service plans. At 100 testers, the storage proposal permits **50 GB**, while ImageKit listed **3 GB** on its free plan when this plan was prepared. Recheck current pricing before selecting a plan. A paid-service budget is a launch prerequisite.

Reference: [ImageKit pricing](https://imagekit.io/plans/).

## First concrete deliverable

A deployed authenticated workflow that turns real uploaded assets into one private, downloadable video, with measured rendering time and cost. That establishes the foundation for the rest of the agreed v1.

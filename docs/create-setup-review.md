# Create setup

Choose any catalog card at `/create` to open its setup screen; All formats returns to the gallery. Selection and form data are local UI state. Returning to the gallery discards the current form; server draft persistence is not implemented.

`CreateSetupProps` and `CreateValues` are exported from `/types`. The form includes every requested section, in reference order. The approved reference choices live in `lib/setup-options.ts`. Platform connections remain false until the backend supplies real state. Credit pricing is null rather than an invented charge. With pricing supplied, the displayed monthly estimate is weekly videos × credits per video × four weeks, rounded up.

The adapter marks backend connections with `TODO(backend)`. It disables Fetch, narrator playback, creation, and Download until their real handlers are connected. File selection still works locally and invokes the upload handler; it does not claim the files were uploaded. The standalone component enables actions by default for a caller that supplies handlers. All fetch/create progress and failures are controlled by props; no timers simulate provider operations.

The visual preview is an illustrative app card, not a generated video. Play/Pause controls a local requestAnimationFrame animation with a 15-second default timeline, caption changes, cursor movement, and progress. It starts paused and does not produce a downloadable file. Aspect ratio, caption look, app name, and style update it locally. The Download button only enables when `downloadAvailable` is true.

Fetched details fill untouched App name and Feature fields. Explicit user edits take precedence. A running creation disables the form. Submissions validate the required name/feature, at least one posting day, and a connected selected destination when publishing. Selecting Send me the files removes publishing destinations from the submitted payload. Disconnected platform cards cannot be selected.

## Visual comparison

Compared the implementation at 1280px and 375px with `design/03-create-setup.png`. No mobile setup screenshot or original prototype CSS is present, so exact source-CSS parity cannot be established. At 375px the options reflow, and the preview moves below the form.

Corrected differences found during inspection:

- Reduced the desktop preview from 290px to the reference's approximately 250px width and adjusted the form/right-column split.
- Restored section-description spacing overridden by the shared paragraph reset.
- Corrected helper copy, option descriptions, and narrator descriptions against the original-resolution screenshot.
- Adjusted option typography, voice row height, textarea height, and the caption sample layout.
- Restored the spacing between the decorative preview header and green app element.

Intentional remaining differences:

- Sora rather than the reference's fallback font, with resulting glyph/line-wrap differences.
- The newer shared sidebar and account menu remain in place.
- Preview starts at 0:00 with Play rather than the reference's captured 0:02/Pause state.
- Real platforms remain unconnected; pricing unavailable; backend-dependent controls disabled in the adapter.
- No generated assets, fake fetch responses, or successful creation notices appear without corresponding props.

## Verification

A temporary harness exercised the exact component without changing Clerk protection; it was removed afterward. Checks passed for fetch, file selection, narrator, and create callbacks; submitted form values; caption appearance; aspect ratio; preview Play/Pause; preset/day counts; loading/error states; disabled disconnected destinations; and 375px horizontal overflow. Screenshots are saved in ignored `artifacts/setup-desktop.png` and `artifacts/setup-mobile.png`. The harness used two credits per video to inspect the reference estimate; the real adapter supplies null.

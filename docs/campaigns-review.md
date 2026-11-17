# Campaigns UI

Implemented the protected `/campaigns` route with a prop-driven editor and schedule.
The route supplies empty backend placeholders; it does not contain demonstration campaigns,
account connections, forecasts, scripts, or credit balances. New campaign opens `/create`.

## Integration

- Public types: `types/campaigns.ts`, exported from `types/index.ts`.
- Screen: `components/campaigns/campaigns.tsx`.
- Connect handlers in `components/campaigns/campaigns-connection.tsx`, then enable actions.
- Supply `month` as `YYYY-MM` and `today` as `YYYY-MM-DD` in the workspace timezone.
- Twice a week uses Monday and Thursday. Weekdays uses Monday through Friday.
  Twice a day counts two ads per eligible date. Past dates are excluded.
- Skipped dates and platform connection status remain controlled props. Every eligible date
  calls `onToggleSkipDate` with the campaign ID and ISO date; the parent supplies updated records.
- Form edits are local and call `onChange`. A replacement campaign record supersedes the draft.
  The backend should invalidate prior approval when creative fields change.
- Generation, approval, client approval, and pause operations use their supplied statuses and
  action message. No timer, network request, or simulated success is implemented.
- The preview is a static design preview, not a rendered video or fabricated playback state.

## Reference review

Compared both tabs at 1280px and inspected both at 375px. Screenshots are in
`artifacts/campaigns/`. The temporary populated browser fixture was removed after testing.

Corrected differences found in the first comparison:

- Shared button font shorthand overrode tab/preset sizes: scoped selectors now retain 12px.
- Status-card helper spacing pushed the editor down: corrected its margin and line-height.
- Platform-card paragraph spacing was overridden by the shared reset: corrected specificity.
- Connected-platform card was shorter than the reference: restored its 300px desktop height.

Remaining intentional/reference limitations:

- Sora is required; the reference screenshots use a fallback font, so text widths differ.
- Screenshot sample names, predictions, connections, credits and simulated-posting disclaimer
  are not embedded in the production page. Test-only records were used to inspect layout.
- The test URL does not activate Campaigns in the sidebar; `/campaigns` uses the existing
  pathname-based active navigation.
- The fixed account button follows viewport height; the supplied full-page screenshot has
  a shorter initial viewport than the browser capture.
- Keyboard focus outlines are visible in the Schedule capture after keyboard navigation.
- `prototype.css` and a Campaigns mobile reference are absent, so exact pixel parity with
  those unavailable sources cannot be certified. Mobile follows the existing 860px breakpoint.

## Validation and security review

Browser checks cover pause/approval guards, script/caption validation, callback IDs, arrow-key
tabs, Enter/Space date skipping, cadence totals, connect/disconnect callbacks, loading/error/empty
states, and no horizontal overflow at 375px. Unit tests cover 14/15, 75/76, 150/151 word limits,
caption boundaries, whole-word CTA matching, leap years, past dates, skips and malformed dates.

The scoped source review found no new HTML injection sink, secret exposure, network endpoint,
or authentication bypass. Text is rendered through React escaping; the production page remains
inside `ProtectedContent`. Calendar input is checked before date formatting.

Client-side approval checks are a UX guard, not authorization. When implementing the backend,
revalidate the saved script/caption and pause state, verify workspace ownership of campaign and
platform IDs, and authorize connect/disconnect and approval operations on the server. Otherwise
attackers could bypass disabled buttons or submit another workspace's IDs (high-risk broken
access control). No such backend endpoint exists in this UI-only change.

# Format gallery

Implemented at `/create`, protected by the existing Clerk page guard.

`FormatGallery` receives `formats`, string-array `categories`, operation `status`, optional `message`/`steps`, `onSelectFormat(id)`, and `onUseOwnRecording`. The types are exported from `/types`. Search and the selected category are local state. All is built in; duplicate categories and a supplied All entry are omitted. If the selected category disappears from props, the view falls back to All.

The page supplies an empty catalog with `TODO(backend)` markers. `format-gallery-connection.tsx` marks the two handler integration points. No format catalog, selection flow, upload simulation, or setup screen is fabricated. The recording card remains available when no formats match or loading the catalog fails. During loading, skeletons replace the grid.

## Reference comparison

Reviewed `design/02-create-gallery.png` at 1280 × 800 and the implementation at 375px. The setup screenshot was used as context; this change implements the gallery only. There is no supplied mobile gallery screenshot or prototype CSS in the checkout, so mobile uses a two-column layout with wrapping filters rather than claiming verified pixel parity.

Matched: title, subtitle, search placeholder, chip row, six desktop columns, 12px horizontal grid gaps, 212px preview heights, the three gradient styles, light preview rectangles, badge positions and colors, names below previews, and the final dashed recording card. A temporary reference-data harness was used to inspect the populated grid and then removed; the real route contains no sample records.

Differences found and resolved:

- Shared button font inheritance overrode chip typography, making the chips too large and moving the grid down three pixels. Scoped typography now keeps the chip height at 32px and the grid at the reference's 206px desktop top position.

Remaining differences and limits:

- Sora is required by the app; the reference uses fallback typography. Glyph shapes, text widths, and wrapping differ.
- The shared sidebar remains the previously requested icon navigation/account-menu version, rather than reverting to this older screenshot's text-only sidebar and prototype disclaimer.
- User/workspace details and the format catalog come from props, so the real route displays its empty state until backend data is supplied.
- Gradient values and unspecified details were reconstructed from screenshots; exact original CSS values remain unverifiable without `prototype.css`.
- The temporary harness URL does not activate Create in the sidebar. The actual `/create` route uses the shared pathname-based active state.

## Validation

Browser checks passed for category/search intersection, whitespace-trimmed case-insensitive matching, keyboard activation, both callback results, no-match behavior, loading skeletons, error and empty states, and 375px horizontal-overflow prevention. Captures are in ignored `artifacts/gallery-desktop.png` and `artifacts/gallery-mobile.png`. The temporary harness and its test data were removed from the application after review.

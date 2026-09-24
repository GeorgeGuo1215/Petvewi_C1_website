# Integration QA

## Verified locally

- 10 automated tests: CSV BOM/quotes/multiline/extra columns, interval-only labels, invalid ranges, duplicate IDs, collision-free generated IDs, missing sensor values, UTC+8, millisecond formatting, midnight and drift/gap checks.
- Real GB18030 interval-label fixture: 222 segments parse and serialize without changing any field; raw fixture is not committed.
- Browser: edited one segment, attempted navigation with an unsaved draft (draft retained), saved and downloaded CSV. Downloaded file has 222 rows; other 221 rows remained unchanged. Source CSV was not overwritten.
- Browser manual sync: video 10 seconds anchored at 15:35:15.098 UTC+8; seeking to 28 seconds displays 15:35:33.098, with no IMU required.
- FFmpeg integration: remux, explicit H.264 conversion, output decode, cancellation, malformed-video failure.
- Website TypeScript, correctness lint and production static export; subpath links/assets checked by `scripts/check-pages.mjs`.

## Boundaries

- Passing tests is not a guarantee of zero defects. Browser codec support differs; video repair cannot recover missing frames.
- Three-frame OCR checks global consistency only, not every timestamp. Approximately ±1 second for second-resolution watermarks; verify local recording discontinuities manually.
- One anchor assumes video and IMU clocks advance at the same rate; no drift estimation. Missing IMU does not block labels.
- Interval editor changes the selected row and boundaries, not automatic interval splitting/merging. Overlaps remain supported with a warning when saving; the first matching CSV row is the displayed label.
- CSV download writes a reviewed copy. It does not overwrite the source or push annotations to GitHub. Confirm the download before leaving.
- Step controls advance 0.04 seconds, not codec-accurate frame stepping for arbitrary frame rates.
- GitHub Pages cannot run server APIs, FFmpeg or macOS Vision. Application submission is disabled there; original server route remains available for full Next.js hosting.
- GitHub Actions deployment must be verified separately after pushing and enabling Pages; a successful local build does not prove the remote deployment is live.

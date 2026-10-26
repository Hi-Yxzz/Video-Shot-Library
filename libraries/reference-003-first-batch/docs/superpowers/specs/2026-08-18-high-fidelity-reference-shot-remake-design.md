# High-Fidelity Reference Shot Remake Design

## Goal

Rebuild the first eight reference-derived shots as high-fidelity Remotion compositions for a reusable 16:9 knowledge-video shot library. The remakes must preserve each source shot's individual visual language while replacing source-specific text, numbers, brands, people, and images with reusable generic examples.

The current fast-pilot renders are motion-inspired adaptations with a shared dark and acid-green theme. They are retained as rollback material but are not acceptable as high-fidelity reference remakes.

## Source

- Reference video: `/Users/admin/Desktop/视频/待镜头复刻/40773550241-1-192.mp4`
- Candidate analysis: `curated-v2/fast-pilot/analysis/reference-001-candidates.md`
- Output: 1920×1080, 30 fps, H.264 MP4, silent

## Remake Set

| Order | Shot | Source interval | Visual identity to preserve |
| --- | --- | --- | --- |
| 1 | Prompt to comparison | 00:26.033–00:34.433 | Forest-green prompt field, rounded line draw, two-column result grid, green/red directional indicators |
| 2 | Case-card constellation | 02:08.800–02:21.300 | Warm-white editorial field, five irregular cards, black center hub, curved connectors, asymmetric card tilt |
| 3 | Metric-card deal | 04:00.833–04:15.067 | Off-white paper field, concept-to-proof transition, paired dark cards, large engraved/tabular numerals |
| 4 | Ranking-row highlight | 04:33.667–04:44.400 | Charcoal/olive table, gold selection band, condensed rank typography, row-centered zoom |
| 5 | Chat-bubble ladder | 02:21.400–02:31.400 | Warm-gray field, generic person on the left, outlined dialogue bubbles on the right, delayed reply |
| 6 | Talking-head keyword stickers | 04:27.300–04:33.667 | Neutral presenter plate, face-safe layout, rough white paper labels, red serif keywords |
| 7 | Leaderboard-card push | 02:41.800–02:47.733 | White/gray field, perspective data panel, progress rows, camera push to a selected lower row |
| 8 | Orbital-tech title | 00:05.733–00:10.033 | Graphite space field, opposing corner masses, framed metallic title, blue technical accents |

## Fidelity Model

Each composition owns its visual tokens. There is no shared palette, background, display font, or decorative system across the eight shots. Shared code is limited to neutral motion helpers, clamped interpolation, and QA metadata.

For each shot, implementation begins from five source frames:

1. Establishing frame
2. Primary entrance frame
3. Information or visual peak
4. Settled reading frame
5. Exit or transition frame

The implementation records for each checkpoint:

- element bounding boxes as percentages of the source frame;
- sampled dominant, surface, text, and accent colors;
- type classification, weight, width, slant, line height, and tracking;
- layer order and occlusion;
- camera scale, pan, roll, and transform origin;
- per-layer parallax ratio;
- background texture and edge treatment;
- entrance order, easing family, overshoot, and settle duration.

## Reusable Content Rules

- Replace names, brands, claims, statistics, and dialogue with generic Chinese examples.
- Preserve the source's approximate character count, line count, numeric width, and information density.
- Replace source photography with generic geometric illustrations, abstract thumbnails, or a neutral reusable person illustration.
- Do not crop recognizable third-party imagery out of the reference video for use in the final compositions.
- Do not retain source watermarks, captions, platform marks, or factual claims.
- Keep user-facing text in data arrays or props where practical, but do not add a configuration system that delays the remake.

## Typography

Font matching is visual, not brand-name driven. Each shot selects installed or bundled fonts by measured appearance:

- Chinese category: sans, serif, condensed, or display;
- weight and stroke contrast;
- character width and punctuation shape;
- numeral form and tabular behavior;
- italic or oblique angle;
- line height and tracking.

If the exact source font cannot be identified or licensed, use the closest available substitute and adjust size, scale, tracking, and line height to match the reference footprint. A single global `FONT_DISPLAY` is forbidden for this remake set.

## Motion and Camera

All motion is deterministic and frame-driven through Remotion. CSS keyframes, transitions, `Math.random()`, and time-based state are forbidden.

- Timing target: reference checkpoint timing within 2–3 frames after editorial compression.
- Layout target: principal element bounds within 5% of the normalized reference frame.
- Camera moves must preserve the source transform origin and direction.
- Parallax must be implemented per layer rather than as a single global scale.
- Readable information must receive a stable hold before exit.
- Motion compression may shorten source intervals, but it may not reorder the source choreography.

## Architecture

Create a new `src/fidelity-remake/` group rather than recoloring the existing fast-pilot components.

- `reference-specs.ts`: checkpoint timings, normalized layout observations, palette samples, and QA frames.
- `shared.tsx`: neutral deterministic helpers only; no visual theme.
- One focused composition file per shot, or two closely related compositions per file when the file stays easy to review.
- `Root.tsx`: register eight new compositions with `Fidelity` IDs.
- `scripts/render-fidelity-remakes.mjs`: render the eight compositions and their checkpoint stills with bounded concurrency.
- `scripts/replace-fidelity-library-items.mjs`: validate all assets, back up the old eight items and preview files, then replace them atomically.

The existing `src/fast-pilot/` code remains untouched until the new set passes visual review. This prevents a partial rewrite from destroying the current preview set.

## Visual QA

For every shot, generate a five-column comparison strip with source on the top row and remake on the bottom row. Review at original 16:9 aspect ratio and at full 1920×1080 resolution.

Blocking failures:

- wrong overall light/dark family or accent hue;
- principal elements in visibly different regions or proportions;
- typography with a materially different width, weight, or hierarchy;
- missing layer, texture, occlusion, or connector;
- incorrect entrance order, camera direction, or transform origin;
- text overflow, clipping, half-settled elements, encoding black frames, or accidental blank holds.

Non-blocking differences:

- generic replacement copy or illustration subject;
- minor texture randomness when deterministic;
- font-name mismatch when the measured visual footprint matches.

The final gate requires:

- TypeScript check;
- all eight compositions load;
- 40 remake QA stills render successfully;
- eight comparison strips reviewed;
- eight MP4 files pass `ffprobe` for H.264, 1920×1080, 30 fps, and expected duration;
- an independent read-only visual review reports no blocking failures.

## Replacement and Rollback

Only after the final gate passes:

1. Copy the current preview MP4 files to a timestamped backup folder.
2. Copy the current `MSFP260818001`–`MSFP260818008` library item directories to a timestamped backup folder.
3. Replace the preview directory with the eight fidelity-remake MP4 files.
4. Replace the media, thumbnails, names, tags, annotations, palettes, and durations in the same eight library item IDs.
5. Verify hashes between render outputs, preview copies, and library copies.

Rollback restores the timestamped preview files and `.info` directories without modifying unrelated library items or root folder metadata.

## Scope Boundaries

- This pass remakes only the eight approved reference shots.
- It does not add audio, voiceover, captions, or music.
- It does not redesign the overall shot-library application.
- It does not delete the fast-pilot source or its rendered backup.
- It does not extract additional reference-video candidates until this set is approved.

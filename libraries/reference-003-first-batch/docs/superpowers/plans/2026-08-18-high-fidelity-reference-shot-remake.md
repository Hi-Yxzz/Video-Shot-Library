# High-Fidelity Reference Shot Remake Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Replace the eight shared-theme fast-pilot previews with eight individually styled, high-fidelity Remotion remakes derived from exact reference-video checkpoints while keeping all example content reusable.

**Architecture:** A typed reference catalog records source checkpoints, independent palettes and typography, normalized anchors, and output durations. Eight focused compositions share deterministic motion utilities but own all visual styling. Render and replacement scripts generate 40 QA stills, eight comparison strips, eight MP4s, and replace only approved preview/library items after validation and backup.

**Tech Stack:** TypeScript, React 19, Remotion 4.0.500, Vitest, FFmpeg/ffprobe, Node.js filesystem scripts.

---

## File map

- Create library-sources/a-roll-remotion/src/fidelity-remake/types.ts for strict reference and checkpoint types.
- Create library-sources/a-roll-remotion/src/fidelity-remake/reference-specs.ts and reference-specs.test.ts for the eight observed source specifications.
- Create library-sources/a-roll-remotion/src/fidelity-remake/motion.ts, motion.test.ts, and shared.tsx for neutral deterministic helpers.
- Create one composition file per shot under library-sources/a-roll-remotion/src/fidelity-remake/shots/.
- Create library-sources/a-roll-remotion/src/fidelity-remake/catalog.ts and catalog.test.ts.
- Modify library-sources/a-roll-remotion/src/Root.tsx to register eight Fidelity compositions.
- Create extraction, rendering, comparison, and replacement scripts under library-sources/a-roll-remotion/scripts/.
- Create library-sources/a-roll-remotion/scripts/replace-fidelity-library-items.test.ts for replacement preflight.

### Task 1: Encode the eight source observations

**Files:**
- Create: library-sources/a-roll-remotion/src/fidelity-remake/types.ts
- Create: library-sources/a-roll-remotion/src/fidelity-remake/reference-specs.ts
- Test: library-sources/a-roll-remotion/src/fidelity-remake/reference-specs.test.ts

- [ ] **Step 1: Write the failing catalog test**

Require exactly eight unique slugs and IDs, five increasing checkpoints per shot, nonempty shot-specific palette and typography observations, normalized anchors in [0, 1], and durations from 120 through 195 frames.

~~~ts
import {describe, expect, it} from "vitest";
import {FIDELITY_REFERENCE_SPECS} from "./reference-specs";

describe("FIDELITY_REFERENCE_SPECS", () => {
  it("contains eight distinct five-checkpoint remakes", () => {
    expect(FIDELITY_REFERENCE_SPECS).toHaveLength(8);
    expect(new Set(FIDELITY_REFERENCE_SPECS.map((shot) => shot.slug)).size).toBe(8);
    for (const shot of FIDELITY_REFERENCE_SPECS) {
      expect(shot.checkpoints).toHaveLength(5);
      expect(shot.checkpoints.map((point) => point.sourceSeconds)).toEqual(
        [...shot.checkpoints.map((point) => point.sourceSeconds)].sort((a, b) => a - b),
      );
      expect(shot.outputDurationInFrames).toBeGreaterThanOrEqual(120);
      expect(shot.outputDurationInFrames).toBeLessThanOrEqual(195);
      expect(shot.typography.length).toBeGreaterThan(0);
      expect(shot.anchors.every((a) => a.x >= 0 && a.x <= 1 && a.y >= 0 && a.y <= 1)).toBe(true);
    }
  });
});
~~~

- [ ] **Step 2: Run the test and confirm it fails**

Run: npx vitest run src/fidelity-remake/reference-specs.test.ts

Expected: FAIL resolving ./reference-specs.

- [ ] **Step 3: Define strict types and all records**

Use these exact slugs and source checkpoints:

~~~ts
export const SOURCE_CHECKPOINTS = {
  "prompt-to-comparison": [26.033, 26.7, 31.8, 33.3, 34.3],
  "case-card-constellation": [128.8, 130, 133, 137, 140.8],
  "metric-card-deal": [240.833, 242.5, 245.8, 249.5, 254.9],
  "ranking-row-highlight": [273.667, 274.4, 277, 280.5, 284.3],
  "chat-bubble-ladder": [141.4, 142, 145, 148, 151.3],
  "talking-head-keyword-stickers": [267.3, 267.9, 269.2, 271.4, 273.5],
  "leaderboard-card-push": [161.8, 162.8, 166, 167, 167.733],
  "orbital-tech-title": [5.733, 6.233, 7.4, 9.4, 10],
} as const;
~~~

Populate palette, typography, layout, camera, parallax, and texture fields from curated-v2/fast-pilot/analysis/reference-001-candidates.md. Use output durations 168, 180, 195, 174, 165, 126, 144, and 120 frames in the slug order above.

- [ ] **Step 4: Run test and TypeScript**

Run: npx vitest run src/fidelity-remake/reference-specs.test.ts && npx tsc --noEmit --project tsconfig.json

Expected: PASS and TypeScript exit 0.

- [ ] **Step 5: Commit**

~~~bash
git add library-sources/a-roll-remotion/src/fidelity-remake
git commit -m "feat: define fidelity remake reference specs"
~~~

### Task 2: Make checkpoint extraction reproducible

**Files:**
- Create: library-sources/a-roll-remotion/scripts/extract-fidelity-reference-frames.mjs

- [ ] **Step 1: Implement extraction validation**

Use source /Users/admin/Desktop/视频/待镜头复刻/40773550241-1-192.mp4. Reject missing or unreadable input. For every catalog checkpoint, run FFmpeg with -ss, -frames:v 1, and scale=1920:1080:flags=lanczos. Write 01-establish.png through 05-exit.png under out/fidelity-remake/reference/<slug>/.

- [ ] **Step 2: Run extractor**

Run: node scripts/extract-fidelity-reference-frames.mjs

Expected: Extracted 40 reference frames for 8 shots.

- [ ] **Step 3: Verify count and dimensions**

Run: find out/fidelity-remake/reference -name '*.png' | wc -l && ffprobe -v error -show_entries stream=width,height -of csv=p=0 out/fidelity-remake/reference/prompt-to-comparison/01-establish.png

Expected: 40 and 1920,1080.

- [ ] **Step 4: Commit only the script**

~~~bash
git add library-sources/a-roll-remotion/scripts/extract-fidelity-reference-frames.mjs
git commit -m "feat: extract fidelity reference checkpoints"
~~~

### Task 3: Add neutral motion and visual primitives

**Files:**
- Create: library-sources/a-roll-remotion/src/fidelity-remake/motion.ts
- Create: library-sources/a-roll-remotion/src/fidelity-remake/motion.test.ts
- Create: library-sources/a-roll-remotion/src/fidelity-remake/shared.tsx

- [ ] **Step 1: Write failing deterministic-progress tests**

~~~ts
import {describe, expect, it} from "vitest";
import {segmentProgress} from "./motion";

describe("segmentProgress", () => {
  it("clamps before and after its segment", () => {
    expect(segmentProgress(2, 10, 20)).toBe(0);
    expect(segmentProgress(15, 10, 20)).toBeCloseTo(0.5);
    expect(segmentProgress(30, 10, 20)).toBe(1);
  });
});
~~~

- [ ] **Step 2: Confirm the missing-module failure**

Run: npx vitest run src/fidelity-remake/motion.test.ts

Expected: FAIL resolving ./motion.

- [ ] **Step 3: Implement neutral helpers**

segmentProgress returns a clamped linear value. settledSpring wraps Remotion spring. dashOffset returns (1 - progress) multiplied by length. shared.tsx exports DeterministicGrain, EdgeVignette, DrawPath, GenericPortrait, and AbstractThumbnail. Every color, opacity, font, and radius is supplied through props; no theme constants are allowed.

- [ ] **Step 4: Test, type-check, and commit**

~~~bash
npx vitest run src/fidelity-remake/motion.test.ts
npx tsc --noEmit --project tsconfig.json
git add library-sources/a-roll-remotion/src/fidelity-remake
git commit -m "feat: add neutral fidelity motion primitives"
~~~

### Task 4: Rebuild prompt and constellation

**Files:**
- Create: library-sources/a-roll-remotion/src/fidelity-remake/shots/PromptToComparison.tsx
- Create: library-sources/a-roll-remotion/src/fidelity-remake/shots/CaseCardConstellation.tsx

- [ ] **Step 1: Implement PromptToComparison**

Use the source forest-green field, diagonal tonal rays, faint grain, and a narrow geometric Chinese sans. Draw the prompt rule clockwise, reveal a two-line generic task, hold, then scan to a label rail and two equal result columns. Stagger rows by three frames; green-up and red-down arrows overshoot and settle. Apply 1.12→1 prompt scale and 1→1.03 result push with separate ray and grain parallax.

- [ ] **Step 2: Implement CaseCardConstellation**

Use a warm-white paper field, radial falloff, and five cards at normalized anchors (0.50,0.18), (0.22,0.39), (0.78,0.39), (0.25,0.72), and (0.76,0.72), rotated within ±8 degrees. Populate generic thumbnails and matching-density copy. Enter top, side, and lower groups with 7–10-frame staggering. Reveal the black center hub and curved connectors last. Pull camera 1.06→1 with distinct card, hub, shadow, and paper parallax.

- [ ] **Step 3: Register temporary development compositions and render ten checkpoint stills**

Expected: ten 1920×1080 PNGs, no text overflow, and no shared dark-green styling on the constellation.

- [ ] **Step 4: Type-check and commit**

~~~bash
npx tsc --noEmit --project tsconfig.json
git add library-sources/a-roll-remotion/src/fidelity-remake/shots
git commit -m "feat: remake prompt and constellation shots"
~~~

### Task 5: Rebuild metric deal and ranking highlight

**Files:**
- Create: library-sources/a-roll-remotion/src/fidelity-remake/shots/MetricCardDeal.tsx
- Create: library-sources/a-roll-remotion/src/fidelity-remake/shots/RankingRowHighlight.tsx

- [ ] **Step 1: Implement MetricCardDeal**

Recreate the off-white concept phase with a generic neural symbol and diagonal claims, then pivot to paired dark cards at x=35% and x=66%. Use condensed italic concept copy, serif-feeling labels, and tabular numerals. Deal from upper center with ±8-degree rotation, 4–6% overshoot, and numeric scale five frames after contact. Use separate rear-card, front-card, tab, symbol, and background parallax.

- [ ] **Step 2: Implement RankingRowHighlight**

Build a charcoal/olive six-row table with condensed rank numerals and mono metadata. Fade and stagger rows, wipe a muted-gold selection band, scale around each selected row's transform origin to reproduce the source crop, blur unselected rows 1–2 px, and return to the full table with multiple gold rows.

- [ ] **Step 3: Render ten checkpoints and verify bounds**

Expected: no clipped rank names, percentages, card tabs, or table metadata.

- [ ] **Step 4: Type-check and commit**

~~~bash
npx tsc --noEmit --project tsconfig.json
git add library-sources/a-roll-remotion/src/fidelity-remake/shots
git commit -m "feat: remake metric deal and ranking shots"
~~~

### Task 6: Rebuild dialogue and presenter overlays

**Files:**
- Create: library-sources/a-roll-remotion/src/fidelity-remake/shots/ChatBubbleLadder.tsx
- Create: library-sources/a-roll-remotion/src/fidelity-remake/shots/TalkingHeadKeywordStickers.tsx

- [ ] **Step 1: Implement ChatBubbleLadder**

Use a warm-gray field, generic illustrated phone-holder on the left 34%, and two outlined bubbles starting near x=48%. Raise the person 18vh over 16 frames, draw the pointer in eight, spring the first bubble from its left anchor, and reveal generic question copy with a clipped mask. After 12 frames, repeat with the larger response bubble. Preserve the locked camera and subtle 1→1.02 push.

- [ ] **Step 2: Implement TalkingHeadKeywordStickers**

Create a neutral generic presenter plate with face-safe zone x=38–62%, y=8–62%. Place four rough white SVG paper labels at the source anchors. Use red Chinese serif keywords in quotes. Stagger by 6–8 frames with scale 1.18→0.96→1 and edge-directed translation, then hold all labels.

- [ ] **Step 3: Render ten checkpoints and verify safe zones**

Expected: no label intersects the generic face or microphone exclusion zone; bubbles remain readable at full resolution.

- [ ] **Step 4: Type-check and commit**

~~~bash
npx tsc --noEmit --project tsconfig.json
git add library-sources/a-roll-remotion/src/fidelity-remake/shots
git commit -m "feat: remake dialogue and presenter overlay shots"
~~~

### Task 7: Rebuild document push and orbital title

**Files:**
- Create: library-sources/a-roll-remotion/src/fidelity-remake/shots/LeaderboardCardPush.tsx
- Create: library-sources/a-roll-remotion/src/fidelity-remake/shots/OrbitalTechTitle.tsx

- [ ] **Step 1: Implement LeaderboardCardPush**

Use a white-to-gray radial field and seven-row white data panel. Enter from (-8vw,18vh), 72% scale, and 3–5-degree Z/Y perspective to a readable 104% hold. Fill progress bars with two-frame row staggering, then push to 150–165% around a lower-row transform origin while the outer field softens.

- [ ] **Step 2: Implement OrbitalTechTitle**

Use graphite, an oversized outline glyph, procedural crater spheres at opposing corners, fine target frame, and blue technical dots. Render a generic metallic title with restrained chrome gradient and blue accent word. Resolve 10–14 px blur over 18 frames, draw frame corners in 8–12, drift corner bodies oppositely, push 1→1.05, and end with a 10–12-frame luminance dissolve.

- [ ] **Step 3: Render ten checkpoints and inspect perspective/cropping**

Expected: the document has a readable hold before its crop; title glyphs and target-frame edges remain intentional.

- [ ] **Step 4: Type-check and commit**

~~~bash
npx tsc --noEmit --project tsconfig.json
git add library-sources/a-roll-remotion/src/fidelity-remake/shots
git commit -m "feat: remake document push and orbital title shots"
~~~

### Task 8: Register a typed fidelity catalog

**Files:**
- Create: library-sources/a-roll-remotion/src/fidelity-remake/catalog.ts
- Test: library-sources/a-roll-remotion/src/fidelity-remake/catalog.test.ts
- Modify: library-sources/a-roll-remotion/src/Root.tsx

- [ ] **Step 1: Write the failing catalog test**

Require exact IDs FidelityPromptToComparison, FidelityCaseCardConstellation, FidelityMetricCardDeal, FidelityRankingRowHighlight, FidelityChatBubbleLadder, FidelityTalkingHeadKeywordStickers, FidelityLeaderboardCardPush, and FidelityOrbitalTechTitle, all at 1920×1080 and 30fps.

- [ ] **Step 2: Confirm failure**

Run: npx vitest run src/fidelity-remake/catalog.test.ts

Expected: FAIL resolving ./catalog.

- [ ] **Step 3: Implement catalog and Root mapping**

Export FIDELITY_COMPOSITIONS with component, duration, dimensions, fps, and five QA frames. Map this array to Composition in Root.tsx instead of duplicating registrations.

- [ ] **Step 4: Verify discovery and commit**

~~~bash
npx vitest run src/fidelity-remake/catalog.test.ts
npx tsc --noEmit --project tsconfig.json
npx remotion compositions src/index.ts --browser-executable='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
git add library-sources/a-roll-remotion/src/fidelity-remake library-sources/a-roll-remotion/src/Root.tsx
git commit -m "feat: register fidelity remake compositions"
~~~

Expected: all tests pass and eight Fidelity IDs appear.

### Task 9: Render checkpoints, MP4s, and comparisons

**Files:**
- Create: library-sources/a-roll-remotion/scripts/render-fidelity-remakes.mjs
- Create: library-sources/a-roll-remotion/scripts/build-fidelity-comparisons.mjs

- [ ] **Step 1: Implement bounded rendering**

Use a script manifest matching the tested IDs. Render five checkpoints and one H.264 MP4 per composition with installed Chrome, CRF 18, muted audio, overwrite, and concurrency 3.

- [ ] **Step 2: Implement comparison strips**

For each slug, scale five source and five remake frames to 480×270, tile source across the top and remake across the bottom, and write out/fidelity-remake/comparisons/<slug>.png at 2400×540.

- [ ] **Step 3: Run**

Run: node scripts/render-fidelity-remakes.mjs && node scripts/build-fidelity-comparisons.mjs

Expected: 40 remake PNGs, eight MP4s, and eight comparison PNGs.

- [ ] **Step 4: Inspect every strip and fix blocking findings**

Check light/dark family, hue, layout, type width/weight, layers, camera direction, transform origin, and settled state. Rerender only failed shots until all eight pass.

- [ ] **Step 5: Commit**

~~~bash
git add library-sources/a-roll-remotion/scripts library-sources/a-roll-remotion/src/fidelity-remake
git commit -m "feat: render and compare fidelity remakes"
~~~

### Task 10: Safely replace preview and library items

**Files:**
- Create: library-sources/a-roll-remotion/scripts/replace-fidelity-library-items.mjs
- Test: library-sources/a-roll-remotion/scripts/replace-fidelity-library-items.test.ts

- [ ] **Step 1: Write failing preflight tests**

Test pure validators for eight MP4s, eight thumbnails, exact library IDs MSFP260818001 through MSFP260818008, folder MSYA24EG3IQC3, matching identities, and target paths restricted to the approved preview/library locations.

- [ ] **Step 2: Confirm failure**

Run: npx vitest run scripts/replace-fidelity-library-items.test.ts

Expected: FAIL resolving replacement helpers.

- [ ] **Step 3: Implement backup and atomic replacement**

Back up /Users/admin/Desktop/视频/待镜头复刻/复刻镜头预览 MP4s and the eight .info directories to timestamped folders. Stage and validate new preview and item directories beside destinations, then rename into place. Update the eight Chinese names, shot-specific palettes, annotations, durations, thumbnails, and preserve folder ID MSYA24EG3IQC3.

- [ ] **Step 4: Test and replace**

Run: npx vitest run scripts/replace-fidelity-library-items.test.ts && node scripts/replace-fidelity-library-items.mjs

Expected: PASS plus eight preview and eight library replacements with printed backup paths.

- [ ] **Step 5: Verify hashes and metadata**

Compare SHA-256 across render, preview, and library copies. Run ffprobe on all copies and assert H.264, 1920×1080, 30fps, and expected durations. Parse metadata and assert identities, thumbnails, and folder.

- [ ] **Step 6: Commit**

~~~bash
git add library-sources/a-roll-remotion/scripts
git commit -m "feat: safely replace fidelity preview items"
~~~

### Task 11: Final verification and independent review

- [ ] **Step 1: Run focused tests**

Run: npx vitest run src/fidelity-remake scripts/replace-fidelity-library-items.test.ts && npx tsc --noEmit --project tsconfig.json && git diff --check

Expected: all tests pass, TypeScript exits 0, and no whitespace errors.

- [ ] **Step 2: Run media inventory**

Require eight render MP4s, eight preview MP4s, eight library MP4s, 40 remake PNGs, eight comparison strips, eight thumbnails, and eight valid metadata files.

- [ ] **Step 3: Dispatch independent read-only review**

Reviewer opens all eight full-size comparison strips and reports PASS/FAIL against the design's blocking criteria. Any FAIL returns to the owning shot task and repeats Tasks 9 and 11.

- [ ] **Step 4: Confirm clean delivery**

Run: git status --short && git log -1 --oneline

Expected: clean worktree and the final local commit visible.

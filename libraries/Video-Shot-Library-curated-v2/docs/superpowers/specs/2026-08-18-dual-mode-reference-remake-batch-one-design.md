# Dual-mode reference remake — batch one

## Goal

Create the first six reusable shot systems from
`/Users/admin/Desktop/视频/待镜头复刻/40615805078-1-192.mp4` in paired
Fast and Fidelity variants. The batch produces twelve silent 16:9 preview
MP4 files.

## Batch scope

| Pair | Reference interval | Shot system | Duration target |
| --- | --- | --- | --- |
| 01 | 00:00.000–00:07.633 | Achievement medal collage | 5.5–6.5 s |
| 02 | 00:26.467–00:44.900 | Talent relationship map to outcomes | 7–8 s |
| 03 | 00:50.033–00:61.833 | Problem origin to staged training | 6–7 s |
| 04 | 01:10.033–01:22.600 | Individual feedback-loop desktop | 5.5–6.5 s |
| 05 | 01:35.400–01:47.400 | Dark biography timeline | 6.5–7.5 s |
| 06 | 02:14.833–02:23.800 | Forked-road decision scene | 5.5–6.5 s |

Repeated layouts elsewhere in the source are variants, not new shot systems.

## Paired-mode contract

Each pair uses the same generic copy, semantic objects, duration, key beats,
and—where applicable—the exact same A-roll file, in/out range, crop, grade,
blur, and overlay timing.

- **Fast** preserves the reference composition, palette relationship, main
  entrance order, and camera rhythm while reducing texture passes, decorative
  layers, occlusion detail, and secondary parallax.
- **Fidelity** recreates the observed typography character, layout ratios,
  paper and print texture, shadows, occlusion, entrance choreography, camera
  push, and multi-depth parallax.
- A-roll is always high fidelity and shared by both modes. Mode differences
  are limited to B-roll treatment.

All branded names, claims, institutions, and personal facts are replaced with
generic reusable examples.

## A-roll policy

Use media from `/Users/admin/Desktop/视频/通用/A-roll` only when the reference
shot includes a person layer. Preferred sources are:

- Keyword or achievement collage: `A07_8.6s_源2.mp4` or `A13_18.0s_源2.mp4`.
- Biography timeline: `A17_24.7s_源1.mp4`.
- Longer archive or picture-in-picture needs: `A16_23.8s_源1.mp4`.

A-roll is 1280×720, constant 30 fps, H.264, and silent. It must be used without
unstable retiming. The shared module owns crop, grade, and timing so the two
variants cannot drift.

## Visual systems

### 01 Achievement medal collage

Warm-gray aged paper, layered person cutouts, a gold medal, oversized pale
Chinese display type, black title strips, and restrained red markers. Layers
enter with offset lateral movement and three depth speeds while the camera
slowly pushes from 1.00 to roughly 1.06.

### 02 Talent relationship map to outcomes

Gray paper and newspaper layers move from a briefcase/talent title into a
two-person relationship map, then resolve into two mustard outcome cards.
Portrait cards, map, connectors, and labels use small rotations and distinct
depth planes.

### 03 Problem origin to staged training

A central person icon is dealt between two yellow archive cards. Black
newspaper strips label the origin and stages. The ending rapidly pushes into
an oversized serif question with a red question mark and underline.

### 04 Individual feedback-loop desktop

A black figurine sits on a macro paper field while gamepad, note, head model,
and document props form a feedback loop. Red-black editorial labels enter in
rhythm. Near objects move faster than the central figure during the push-in.

### 05 Dark biography timeline

Deep brown-black field, white biography copy, magenta quotation marks and
highlight bars, with a softly defocused shared A-roll figure at the right.
Timeline entries wipe in sequentially and selected facts receive a scanning
highlight. Camera motion remains restrained.

### 06 Forked-road decision scene

Bright gray paper, oversized black serif headline, red underline, central
back-facing figure, and a Y-shaped black road/shadow. The road grows from the
feet toward the foreground, editorial choice labels attach in sequence, and
the camera advances along the road.

## Motion and smoothness requirements

- All motion is derived from `useCurrentFrame()` with deterministic
  interpolation or springs; no CSS animations, real-time clocks, or random
  values.
- Output is 1920×1080, 30 fps, H.264, silent, with exact integer frame counts.
- Source A-roll is not variably retimed.
- Camera and layer curves must be continuous at segment boundaries.
- Validation checks composition metadata, decoded frame count, packet timing,
  duplicate-frame runs, dropped-frame indications, and visual continuity.
- Intentional holds are allowed but must be documented and must not resemble
  a rendering stall.

## Outputs

Composition IDs use a `Fast406158...` or `Fidelity406158...` prefix. Preview
files use paired numbering and are copied to
`/Users/admin/Desktop/视频/待镜头复刻/复刻镜头预览` without overwriting earlier
samples. Reference, remake, and comparison stills remain in the Remotion
project `out` tree and are not committed.

## Verification

1. Unit tests cover frame contracts, key-beat ordering, finite transforms, and
   shared A-roll equality between paired modes.
2. TypeScript and Remotion composition enumeration pass.
3. Five QA frames per variant are compared with the source checkpoints.
4. Every MP4 passes ffprobe metadata checks and decoded-frame continuity
   inspection.
5. Only visible fidelity or smoothness defects trigger revision; unrelated
   infrastructure work is out of scope.

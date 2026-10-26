# Reference 001 — reusable shot candidates

Source: `/Users/admin/Desktop/视频/待镜头复刻/40773550241-1-192.mp4`
Verified media: 349.653 s, 1280×720, H.264, nominal 30 fps (average ≈29.999 fps), AAC 48 kHz stereo.
Method: 5 s overview contact sheets, scene-change scan, 2 fps interval sheets, then timestamp-addressed PNG extraction. Times below are source timecodes; the proposed Remotion versions deliberately compress the longer editorial examples.

## 1. `prompt-to-comparison` — 需求框转双列对比

- **Source interval:** `00:26.033–00:34.433`
- **Key timestamps:** establish `00:26.033`; entrance `00:26.700`; peak `00:31.800`; settle `00:33.300`; exit `00:34.300`
- **Source visual:** deep green field; a rounded-corner prompt frame draws on and a Chinese task sentence resolves inside it. The composition then changes to a two-column model comparison with aligned labels, values, and green/red arrows.
- **Purpose/category:** premise → evidence; prompt visualization; A/B comparison/data card.
- **Scores:** information 9/10; visual finish 9/10; camera/motion 8/10; reuse 10/10; implementation value 9/10; **total 45/50**.
- **Frame-by-frame motion breakdown:**
  - **Layout grid:** 12-column canvas; prompt occupies columns 3–10 at mid-height. Comparison uses a narrow label rail in columns 2–3 and two equal value columns in 4–7 and 8–11.
  - **Type:** geometric Chinese sans, medium weight, high line height; comparison model names are light italic sans. Replace with Source Han Sans SC/Alibaba PuHuiTi 2 plus Inter or IBM Plex Sans Italic.
  - **Entrance:** top-left rounded rule grows clockwise while text reveals left-to-right with a soft mask; about 18–24 frames, cubic ease-out. On the comparison change, column headings arrive first, then rows stagger 3–4 frames, arrows overshoot roughly 6% and settle with `easeOutBack(1.2)`.
  - **Camera:** prompt starts around 112% scale and eases to 100%; comparison receives a restrained 100→103% push. No pan.
  - **Parallax:** foreground text/rules 1.0×; midground soft green rays 0.35×; background vignette/noise 0.12×.
  - **Background:** near-black forest green, diagonal tonal rays, light grain, faint edge vignette; no asset dependency.
  - **Audio sync:** attach the prompt border completion to the spoken task clause; land the comparison cut/impact on the narration's result phrase, then let numeric arrows tick on the two named values.
- **Originality adaptation:** preserve the prompt→answer transformation, grid discipline, arrow polarity, and breathing hold; generalize all labels/metrics; replace model names and source-specific numbers; discard uploader watermark and platform-specific phrasing.
- **Proposed Remotion duration:** 5.6 s at 30 fps. **Difficulty:** medium.
- **Validated PNGs:** `/tmp/fast-pilot-reference-001/keyframes/prompt_compare-01-26.033.png`, `/tmp/fast-pilot-reference-001/keyframes/prompt_compare-02-26.700.png`, `/tmp/fast-pilot-reference-001/keyframes/prompt_compare-03-29.500.png`, `/tmp/fast-pilot-reference-001/keyframes/prompt_compare-04-31.800.png`, `/tmp/fast-pilot-reference-001/keyframes/prompt_compare-05-34.300.png`.

## 2. `case-card-constellation` — 案例卡片星座

- **Source interval:** `02:08.800–02:21.300`
- **Key timestamps:** establish `02:08.800`; entrance `02:10.000`; peak `02:17.000`; settle `02:20.800`; exit `02:21.300`
- **Source visual:** a single floating case card becomes a five-card constellation. Cards enter from different frame edges with mild 3D tilt; a central black circular label appears last and curved connector lines turn the cluster into a summary map.
- **Purpose/category:** examples/evidence aggregation; taxonomy; hub-and-spoke summary.
- **Scores:** information 9/10; visual finish 9/10; camera/motion 9/10; reuse 10/10; implementation value 9/10; **total 46/50**.
- **Frame-by-frame motion breakdown:**
  - **Layout grid:** center hub at `(50%,50%)`; cards anchor near `(50,18)`, `(22,39)`, `(78,39)`, `(25,72)`, `(76,72)`. Deliberate asymmetric rotations keep the layout editorial rather than diagrammatic.
  - **Type:** compact neutral sans inside cards, tiny eyebrow labels, centered semibold hub. Use Inter/Source Han Sans SC; keep card copy to one headline and one micro-label.
  - **Entrance:** first card drops from `y=-18vh`; lateral cards slide from ±20vw with `rotateZ` ±5–8° and `rotateY` ±6°. Lower cards rise from `y=14vh`. Stagger 7–10 frames; spring damping around 18, stiffness around 110. Hub scales 0.72→1; connectors draw with `strokeDashoffset` after cards settle.
  - **Camera:** global 106→100% pullback reveals the growing system; near-imperceptible clockwise roll, under 0.5°.
  - **Parallax:** foreground card faces 1.0×; hub/connectors 0.72×; card shadows 0.45×; background grain 0.08×.
  - **Background:** warm white/very pale gray, radial vignette, soft card shadows with a slight bottom-right cast; use programmatic placeholder illustrations or licensed-safe generic crops.
  - **Audio sync:** one soft whoosh per card group rather than per card; central hub lands on the narrator's summary clause; connector draw can use a quiet pencil/tick texture.
- **Originality adaptation:** preserve edge-to-center choreography, uneven card angles, and hub reveal; generalize card count to 3–6 and expose positions as data; replace every photo with abstract shapes, icons, or user-owned media; discard source anecdotes and all recognizable third-party imagery.
- **Proposed Remotion duration:** 6.0 s at 30 fps. **Difficulty:** medium-high.
- **Validated PNGs:** `/tmp/fast-pilot-reference-001/keyframes/case_constellation-01-128.800.png`, `/tmp/fast-pilot-reference-001/keyframes/case_constellation-02-130.000.png`, `/tmp/fast-pilot-reference-001/keyframes/case_constellation-03-133.000.png`, `/tmp/fast-pilot-reference-001/keyframes/case_constellation-04-137.000.png`, `/tmp/fast-pilot-reference-001/keyframes/case_constellation-05-140.800.png`.

## 3. `metric-card-deal` — 指标卡发牌对照

- **Source interval:** `04:00.833–04:15.067`
- **Key timestamps:** establish `04:00.833`; entrance `04:02.500`; peak `04:09.500`; settle `04:14.900`; exit `04:15.067`
- **Source visual:** a grayscale brain and two short claim strips establish a concept. The scene pivots to paired dark metric cards; first one pair, then a second pair deals in with different percentages and small category tabs.
- **Purpose/category:** concept → measured result; before/after or cohort comparison; score reveal.
- **Scores:** information 9/10; visual finish 9/10; camera/motion 9/10; reuse 9/10; implementation value 9/10; **total 45/50**.
- **Frame-by-frame motion breakdown:**
  - **Layout grid:** concept phase centered in columns 4–9; comparison phase uses two card groups around x=35% and x=66%, each group containing a rear baseline card and front current card.
  - **Type:** condensed italic display for the concept label, serif/engraved-feeling card titles, oversized tabular numerals. Replace with Barlow Condensed Italic + Noto Serif SC or IBM Plex Sans + tabular figures.
  - **Entrance:** brain scales 0.55→1 with a 12-frame blur reduction; claim strips slide diagonally from opposite sides. Cards use a physical deal: translate from center/top, rotateZ ±8°, overshoot 4–6%, then damp. Numerals scale 0.85→1 separately 5 frames after card contact.
  - **Camera:** 102→108% push on concept; snap-cut/pivot to 96% for cards, then 96→101% creep. Keep camera movement subordinate to deal motion.
  - **Parallax:** front cards 1.0×; rear cards 0.78×; tabs 1.12×; brain/claim strips 0.85×; background arcs 0.22×.
  - **Background:** off-white radial vignette, thin suspended curves, subtle paper grain, soft black pin at top; all reproducible with SVG/CSS.
  - **Audio sync:** concept label lands on the key noun; each pair uses a single card slap/low tick; numeric pop aligns to spoken percentage, with the second pair on the contrast conjunction.
- **Originality adaptation:** preserve two-stage concept→proof arc, card-deal physics, paired group hierarchy, and numeric emphasis; generalize to any two metrics/categories; replace brain with a generic SVG symbol when irrelevant; replace brand lettering and exact percentages; discard faux product branding and watermarks.
- **Proposed Remotion duration:** 6.5 s at 30 fps. **Difficulty:** high.
- **Validated PNGs:** `/tmp/fast-pilot-reference-001/keyframes/score_cards-01-240.833.png`, `/tmp/fast-pilot-reference-001/keyframes/score_cards-02-242.500.png`, `/tmp/fast-pilot-reference-001/keyframes/score_cards-03-245.800.png`, `/tmp/fast-pilot-reference-001/keyframes/score_cards-04-249.500.png`, `/tmp/fast-pilot-reference-001/keyframes/score_cards-05-254.900.png`.

## 4. `ranking-row-highlight` — 排行榜逐行高亮

- **Source interval:** `04:33.667–04:44.400`
- **Key timestamps:** establish `04:33.667`; entrance `04:34.400`; peak `04:37.000`; settle `04:40.500`; exit `04:44.300`
- **Source visual:** a dark six-row ranking table fades into legibility. A gold horizontal selection band expands/zooms over successive ranks, temporarily turning the list into large cropped typography before returning to the whole table with several highlighted rows.
- **Purpose/category:** rank/context; sequential reveal; competitive landscape.
- **Scores:** information 10/10; visual finish 8/10; camera/motion 8/10; reuse 10/10; implementation value 8/10; **total 44/50**.
- **Frame-by-frame motion breakdown:**
  - **Layout grid:** title/meta strip in top 12%; six equal rows below; rank numeral takes 8% width, entity 45%, metadata the remainder. Highlight is a full-row rounded rectangle.
  - **Type:** white condensed sans with oversized rank numerals and compact mono metadata. Use DIN Condensed/Barlow Condensed plus IBM Plex Mono; enable tabular numerals.
  - **Entrance:** overall table opacity 0→1 over 12 frames; rows translate `y=10px→0` with 2-frame stagger. Gold highlight wipes left→right in 8–10 frames. Selected row zooms 100→190% with `easeInOutCubic`, crops at frame edges, then returns; later rows highlight in sequence.
  - **Camera:** camera behavior is mostly simulated by scaling the table around the selected row's transform origin; add no independent pan.
  - **Parallax:** selected row 1.0×; unselected rows 0.65× and blur 1–2 px during zoom; oversized ghost glyph 0.28×; background 0.08×.
  - **Background:** charcoal/olive field, vignette, mild bloom around gold, 2% monochrome noise.
  - **Audio sync:** highlight wipes should hit the spoken ordinal/name; use restrained ticks for row changes and one low impact on the first extreme crop.
- **Originality adaptation:** preserve table geometry, selected-row transform origin, sequential gold wipe, and final context view; generalize data schema and row count; replace organizations, scores, and logos with plain text or caller-provided icons; discard source ranking claims and decorative watermark.
- **Proposed Remotion duration:** 5.8 s at 30 fps. **Difficulty:** medium.
- **Validated PNGs:** `/tmp/fast-pilot-reference-001/keyframes/ranking_highlight-01-273.667.png`, `/tmp/fast-pilot-reference-001/keyframes/ranking_highlight-02-274.400.png`, `/tmp/fast-pilot-reference-001/keyframes/ranking_highlight-03-277.000.png`, `/tmp/fast-pilot-reference-001/keyframes/ranking_highlight-04-280.500.png`, `/tmp/fast-pilot-reference-001/keyframes/ranking_highlight-05-284.300.png`.

## 5. `chat-bubble-ladder` — 人物旁聊天气泡递进

- **Source interval:** `02:21.400–02:31.400`
- **Key timestamps:** establish `02:21.400`; entrance `02:22.000`; peak `02:25.000`; settle `02:28.000`; exit `02:31.300`
- **Source visual:** a cutout person holding a phone rises from the lower-left. A pointer stem grows into a first outlined message bubble; text types across it. A second larger bubble appears below and fills with a longer reply.
- **Purpose/category:** quote/dialogue; user story; question→answer or objection→resolution.
- **Scores:** information 9/10; visual finish 8/10; camera/motion 8/10; reuse 10/10; implementation value 8/10; **total 43/50**.
- **Frame-by-frame motion breakdown:**
  - **Layout grid:** person occupies left 34% and lower 85%; bubble stack begins around x=48%, using 44% width with 24–32 px vertical gap; pointer ends near the face/phone.
  - **Type:** light neutral Chinese sans at small size. Use Source Han Sans SC/Inter, 400–500 weight, 1.45 line-height; keep bubble copy under two lines when possible.
  - **Entrance:** person rises 18vh and fades over 16 frames with `easeOutCubic`; pointer line draws 8 frames; bubble width grows from its left anchor with spring damping ~22; text uses a clipped reveal or deterministic 2–3 character cadence. Second bubble repeats after a 12-frame pause.
  - **Camera:** locked; optional 100→102% push across the full scene.
  - **Parallax:** cutout 1.0×; bubbles 0.92×; pointers 0.86×; shadow 0.45×; background 0.05×.
  - **Background:** warm gray/off-white with a light bottom vignette and soft contact shadow. The person can be replaced by a generic licensed cutout, an illustrated avatar, or omitted for a pure UI variant.
  - **Audio sync:** open the first bubble on the quoted question and type to speech cadence; second bubble starts on the response turn. Avoid a key click per character—one open tick and a soft completion tone are enough.
- **Originality adaptation:** preserve person-left/bubbles-right grammar, pointer growth, delayed response, and readable pause; generalize speaker/avatar and all copy; replace the source cutout with owned or licensed-safe material; discard the specific joke/anecdote and platform marks.
- **Proposed Remotion duration:** 5.5 s at 30 fps. **Difficulty:** medium.
- **Validated PNGs:** `/tmp/fast-pilot-reference-001/keyframes/chat_ladder-01-141.400.png`, `/tmp/fast-pilot-reference-001/keyframes/chat_ladder-02-142.000.png`, `/tmp/fast-pilot-reference-001/keyframes/chat_ladder-03-145.000.png`, `/tmp/fast-pilot-reference-001/keyframes/chat_ladder-04-148.000.png`, `/tmp/fast-pilot-reference-001/keyframes/chat_ladder-05-151.300.png`.

## 6. `talking-head-keyword-stickers` — 口播关键词贴纸

- **Source interval:** `04:27.300–04:33.667`
- **Key timestamps:** establish `04:27.300`; entrance `04:27.900`; peak `04:29.200`; settle `04:31.400`; exit `04:33.500`
- **Source visual:** four rough-edged white labels containing red quoted keywords pop around the presenter, carefully avoiding the face and microphone. They form a balanced two-left/two-right annotation field and disappear before the next data insert.
- **Purpose/category:** talking-head emphasis; enumerated entities; semantic annotation.
- **Scores:** information 8/10; visual finish 8/10; camera/motion 8/10; reuse 10/10; implementation value 8/10; **total 42/50**.
- **Frame-by-frame motion breakdown:**
  - **Layout grid:** reserve a central face-safe zone (x=38–62%, y=8–62%). Stickers occupy upper-left, mid-left, upper-right, and lower-right anchors; use an exclusion rectangle for captions/microphone.
  - **Type:** red high-contrast Chinese serif with quotation marks on torn white brush rectangles. Use Noto Serif SC/Songti SC Semibold; generate the rough edge as SVG turbulence/displacement or a reusable alpha mask.
  - **Entrance:** sticker scales 1.18→0.96→1 and translates 18–28 px from the nearest edge; stagger 6–8 frames in spoken order. A 1-frame red offset/ink smear may precede the white plate. Ease with a short underdamped spring, then hold.
  - **Camera:** inherit source talking-head shot; overlay remains screen-space locked. Optional micro-push on the base footage only.
  - **Parallax:** stickers 1.0× screen space; ink shadow 0.8×; base presenter 0.35× if a virtual push is applied; room background 0.1×.
  - **Background:** source footage remains visible; add no global texture beyond sticker fibers and a very soft dark shadow for separation.
  - **Audio sync:** each sticker hits the first stressed syllable of its spoken keyword; the fourth closes the list. Use dry paper taps at low level, not four identical loud impacts.
- **Originality adaptation:** preserve face-aware auto-layout, spoken-order staggering, rough paper/red serif contrast, and simultaneous final hold; generalize to 2–5 keywords; replace the presenter footage and words; discard source names, quotes, subtitles, and watermarks.
- **Proposed Remotion duration:** 4.2 s at 30 fps. **Difficulty:** low-medium.
- **Validated PNGs:** `/tmp/fast-pilot-reference-001/keyframes/keyword_stickers-01-267.300.png`, `/tmp/fast-pilot-reference-001/keyframes/keyword_stickers-02-267.900.png`, `/tmp/fast-pilot-reference-001/keyframes/keyword_stickers-03-269.200.png`, `/tmp/fast-pilot-reference-001/keyframes/keyword_stickers-04-271.400.png`, `/tmp/fast-pilot-reference-001/keyframes/keyword_stickers-05-273.500.png`.

## 7. `leaderboard-card-push` — 排行榜卡片推近

- **Source interval:** `02:41.800–02:47.733` (trim ends before the following compute-cost title begins)
- **Key timestamps:** establish `02:41.800`; entrance `02:42.800`; peak `02:46.000`; settle `02:47.000`; exit `02:47.733`
- **Source visual:** a white leaderboard panel rises from below-left in perspective, grows to nearly fill the frame, then pushes into a close crop of the lower rows while the outer field falls out of focus.
- **Purpose/category:** document/data inspection; zoom-to-detail; evidence insert.
- **Scores:** information 9/10; visual finish 8/10; camera/motion 8/10; reuse 8/10; implementation value 8/10; **total 41/50**.
- **Frame-by-frame motion breakdown:**
  - **Layout grid:** page is a 16:9-ish panel tilted roughly 3–5° in Z and slightly in Y; internal table uses header + seven rows, left-aligned labels, horizontal progress bars, and a narrow value rail.
  - **Type:** compact UI grotesk plus mono-ish metadata. Use Inter/IBM Plex Sans and IBM Plex Mono; keep internal type above an equivalent 18 px at final 1280×720 output.
  - **Entrance:** panel translates `(-8vw,18vh)→(0,0)`, rotates toward camera, and scales roughly 72→104% over 28–34 frames with `easeOutQuart`; bars can fill left-to-right with a 2-frame row stagger. Final detail push scales to 150–165% around a lower-row transform origin.
  - **Camera:** combined dolly-in and slight rightward pan; reduce motion blur at settle to keep the table readable.
  - **Parallax:** page face 1.0×; raised header/tab 1.08×; shadow 0.5×; background floor/vignette 0.12×.
  - **Background:** clean white-to-gray radial falloff, shallow shadow under the panel, mild chromatic/fringe treatment only during motion.
  - **Audio sync:** panel arrival on the evidence-introduction clause; progress bars on successive names/values; close push on the sentence that interprets the relevant row.
- **Originality adaptation:** preserve perspective arrival, legible intermediate hold, and zoom-to-row transform origin; generalize the table schema; replace all organizations/logos/scores with generated demo data; discard source benchmark branding and the following stock-photo title treatment.
- **Proposed Remotion duration:** 4.8 s at 30 fps. **Difficulty:** medium.
- **Validated PNGs:** `/tmp/fast-pilot-reference-001/keyframes/leaderboard_orbit-01-161.800.png`, `/tmp/fast-pilot-reference-001/keyframes/leaderboard_orbit-02-162.800.png`, `/tmp/fast-pilot-reference-001/keyframes/leaderboard_orbit-03-166.000.png`, `/tmp/fast-pilot-reference-001/keyframes/leaderboard-exit-167.000.png`, `/tmp/fast-pilot-reference-001/keyframes/leaderboard-exit-168.000.png` (last frame is the rejected next-shot boundary check).

## 8. `orbital-tech-title` — 轨道科技主标题

- **Source interval:** `00:05.733–00:10.033` (end includes the first dissolve frame only)
- **Key timestamps:** establish `00:05.733`; entrance `00:06.233`; peak `00:07.400`; settle `00:09.400`; exit `00:10.033`
- **Source visual:** metallic/white title with a blue accent word sits inside a fine rectangular targeting frame. Large lunar/rock forms occupy opposite corners, faint oversized outline glyphs sit behind, and tiny blue points provide technical detail. The title sharpens and subtly pushes forward before dissolving.
- **Purpose/category:** chapter/hero title; subject introduction; premium visual reset.
- **Scores:** information 7/10; visual finish 9/10; camera/motion 8/10; reuse 8/10; implementation value 8/10; **total 40/50**.
- **Frame-by-frame motion breakdown:**
  - **Layout grid:** hero word centered across columns 4–9; corner masses at top-right and bottom-left; oversized outline glyph spans the full safe area; thin frame inset about 18% horizontally and 27% vertically.
  - **Type:** bold geometric/industrial sans with a chrome fill and blue accent. Use Space Grotesk Bold, Sora ExtraBold, or DIN Condensed; create chrome with a CSS linear gradient and restrained inner highlight rather than rasterized branded lettering.
  - **Entrance:** title begins at 106% with 10–14 px blur and resolves to 100%/0 px over 18 frames; frame corners draw in 8–12 frames; blue dots blink once. Exit uses a 10–12 frame luminance dissolve into the base shot.
  - **Camera:** slow 100→105% push; corner objects drift in opposite directions by 8–14 px, creating an orbital feel without a full 3D scene.
  - **Parallax:** title/frame 1.0×; corner bodies 0.65×; ghost glyph 0.28×; star/noise field 0.1×.
  - **Background:** black/graphite, faint grid/outline typography, grayscale crater textures. Replace the lunar photos with procedural SVG noise circles, generated abstract spheres, or licensed-safe textures.
  - **Audio sync:** blur-to-sharp peak on the spoken subject name; one sub impact at title lock and a light digital tick on the frame corner. Start the dissolve after the sentence's final stressed word.
- **Originality adaptation:** preserve opposing corner masses, framed central title, blue micro-accent, blur resolve, and long settle; generalize the title and tonal palette; replace all crater imagery and lettering; discard source brand name, watermark, and literal logo resemblance.
- **Proposed Remotion duration:** 4.0 s at 30 fps. **Difficulty:** medium.
- **Validated PNGs:** `/tmp/fast-pilot-reference-001/keyframes/space-01-5.733.png`, `/tmp/fast-pilot-reference-001/keyframes/space-02-6.233.png`, `/tmp/fast-pilot-reference-001/keyframes/space-03-7.400.png`, `/tmp/fast-pilot-reference-001/keyframes/space-probe-9.400.png`, `/tmp/fast-pilot-reference-001/keyframes/space-exit-10.000.png`.

## Recommended first six

Prioritize the following six as the pilot set, in this order of library value:

1. `case-card-constellation` — multi-object spatial choreography + hub-and-spoke synthesis.
2. `prompt-to-comparison` — shape-draw/text-mask transition into a structured A/B grid.
3. `metric-card-deal` — physical card dealing + numeric result reveal.
4. `ranking-row-highlight` — data-list focus navigation via transform-origin zoom and row wipes.
5. `chat-bubble-ladder` — character/cutout staging + sequential conversational UI.
6. `talking-head-keyword-stickers` — screen-space annotations designed around a face-safe zone.

This set deliberately covers six distinct motion grammars: constellation assembly, morph/cut between information states, inertial card physics, camera-like focus within dense data, dialogue progression, and presenter-attached overlays. `leaderboard-card-push` is the best seventh addition when the library needs a document-camera move; `orbital-tech-title` is the best eighth addition when it needs a polished chapter opener. Neither should displace the first six because document pushes and hero titles are already easier to source elsewhere and add less behavioral diversity.

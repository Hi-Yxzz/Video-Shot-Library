export const stageProgress = (frame: number, start: number, end: number) => {
  if (![frame, start, end].every(Number.isFinite)) {
    throw new Error(
      "stageProgress requires finite frame, start, and end values",
    );
  }
  if (end <= start) {
    throw new Error("stageProgress end must be greater than start");
  }

  const linear = Math.min(1, Math.max(0, (frame - start) / (end - start)));
  return 1 - (1 - linear) ** 3;
};

const localSpringFrame = (frame: number, start: number) =>
  Math.max(0, frame - start);

export const getOpinionTypeFastState = (frame: number) => ({
  header: stageProgress(frame, 2, 10),
  line2: stageProgress(frame, 18, 29),
  line3: stageProgress(frame, 30, 43),
  baseline: stageProgress(frame, 9, 30),
  label1: stageProgress(frame, 48, 55),
  label2: stageProgress(frame, 54, 61),
  label3: stageProgress(frame, 60, 67),
  scan: stageProgress(frame, 42, 58),
  camera: stageProgress(frame, 0, 95),
  headlineSpringFrame: localSpringFrame(frame, 8),
});

export const getOpinionTypeFidelityState = (frame: number) => ({
  cursor: 1,
  statement: stageProgress(frame, 12, 30),
  keyword: stageProgress(frame, 30, 44),
  suffix: stageProgress(frame, 40, 58),
  label1: stageProgress(frame, 48, 60),
  label2: stageProgress(frame, 54, 66),
  label3: stageProgress(frame, 60, 72),
  grid: stageProgress(frame, 58, 90),
  camera: stageProgress(frame, 0, 95),
  kickerSpringFrame: localSpringFrame(frame, 8),
});

export const getChatPanelFastState = (frame: number) => ({
  panel: stageProgress(frame, 3, 31),
  header: stageProgress(frame, 8, 20),
  tags: stageProgress(frame, 96, 112),
  scan: stageProgress(frame, 16, 36),
  camera: stageProgress(frame, 0, 161),
  panelSpringFrame: localSpringFrame(frame, 3),
  bubble1SpringFrame: localSpringFrame(frame, 24),
  bubble2SpringFrame: localSpringFrame(frame, 45),
  bubble3SpringFrame: localSpringFrame(frame, 67),
});

export const getChatPanelFidelityState = (frame: number) => ({
  sliverExit: stageProgress(frame, 6, 15),
  panel: stageProgress(frame, 4, 48),
  title: stageProgress(frame, 18, 35),
  bubble1: stageProgress(frame, 48, 72),
  bubble2: stageProgress(frame, 72, 96),
  bubble3: stageProgress(frame, 96, 120),
  tags: stageProgress(frame, 120, 142),
  camera: stageProgress(frame, 0, 161),
  panelSpringFrame: localSpringFrame(frame, 4),
  bubble1SpringFrame: localSpringFrame(frame, 48),
  bubble2SpringFrame: localSpringFrame(frame, 72),
  bubble3SpringFrame: localSpringFrame(frame, 96),
});

const phaseIndex = (frame: number, starts: readonly number[]) =>
  starts.reduce((phase, start) => phase + Number(frame >= start), 0);

export const getHardwareDispatchFastState = (frame: number) => ({
  grid: stageProgress(frame, 4, 20),
  title: stageProgress(frame, 10, 34),
  metrics: stageProgress(frame, 26, 66),
  nodes: stageProgress(frame, 12, 50),
  routes: stageProgress(frame, 54, 112),
  highlight: stageProgress(frame, 96, 172),
  camera: stageProgress(frame, 0, 209),
  phaseIndex: phaseIndex(frame, [12, 46, 92, 154]),
  tile1SpringFrame: localSpringFrame(frame, 12),
  tile2SpringFrame: localSpringFrame(frame, 44),
  tile3SpringFrame: localSpringFrame(frame, 78),
});

export const getHardwareDispatchFidelityState = (frame: number) => ({
  amberCopy: stageProgress(frame, 16, 34),
  bars: stageProgress(frame, 24, 56),
  whiteTitle: stageProgress(frame, 72, 104),
  parameters: stageProgress(frame, 78, 122),
  nearBar: stageProgress(frame, 128, 196),
  camera: stageProgress(frame, 0, 209),
  phaseIndex: phaseIndex(frame, [16, 24, 78, 128]),
  bar1SpringFrame: localSpringFrame(frame, 24),
  bar2SpringFrame: localSpringFrame(frame, 34),
});

export const getProfileCarouselFastState = (frame: number) => ({
  deck: stageProgress(frame, 8, 36),
  details: stageProgress(frame, 28, 72),
  rail: stageProgress(frame, 48, 128),
  camera: stageProgress(frame, 0, 266),
  activeProfileIndex: phaseIndex(frame, [82, 148, 216]),
  trackShift:
    452 *
    (stageProgress(frame, 82, 102) +
      stageProgress(frame, 148, 168) +
      stageProgress(frame, 216, 236)),
  card1SpringFrame: localSpringFrame(frame, 16),
  card2SpringFrame: localSpringFrame(frame, 82),
  card3SpringFrame: localSpringFrame(frame, 148),
  card4SpringFrame: localSpringFrame(frame, 216),
});

export const getProfileCarouselFidelityState = (frame: number) => ({
  profile1: stageProgress(frame, 20, 44) * (1 - stageProgress(frame, 76, 100)),
  profile2:
    stageProgress(frame, 76, 100) * (1 - stageProgress(frame, 138, 162)),
  profile3:
    stageProgress(frame, 140, 164) * (1 - stageProgress(frame, 208, 232)),
  profile4: stageProgress(frame, 208, 232),
  letters: stageProgress(frame, 22, 44) * (1 - stageProgress(frame, 126, 152)),
  camera: stageProgress(frame, 0, 266),
  activeProfileIndex: phaseIndex(frame, [76, 140, 208]),
  profile1SpringFrame: localSpringFrame(frame, 22),
  profile2SpringFrame: localSpringFrame(frame, 76),
  profile3SpringFrame: localSpringFrame(frame, 140),
  profile4SpringFrame: localSpringFrame(frame, 208),
});

export const getKeywordTypeFidelityState = (frame: number) => ({
  paper: stageProgress(frame, 2, 16),
  headline: stageProgress(frame, 12, 40),
  keyword: stageProgress(frame, 34, 62),
  underline: stageProgress(frame, 56, 82),
  microcopy: stageProgress(frame, 72, 104),
  camera: stageProgress(frame, 0, 143),
});

export const getQuotePanelPushFidelityState = (frame: number) => ({
  panel: stageProgress(frame, 4, 34),
  frame: stageProgress(frame, 10, 40),
  quote: stageProgress(frame, 30, 74),
  macroQuote: stageProgress(frame, 86, 142),
  shadow: stageProgress(frame, 16, 52),
  camera: stageProgress(frame, 0, 223),
  panelSpringFrame: localSpringFrame(frame, 4),
});

export const getMetalComputeArrayFidelityState = (frame: number) => ({
  blocks: stageProgress(frame, 10, 60),
  edgeLight: stageProgress(frame, 40, 106),
  labels: stageProgress(frame, 86, 144),
  depth: stageProgress(frame, 120, 210),
  camera: stageProgress(frame, 0, 294),
  block1SpringFrame: localSpringFrame(frame, 10),
  block2SpringFrame: localSpringFrame(frame, 28),
  block3SpringFrame: localSpringFrame(frame, 46),
});

export const getEvidenceArticlePushFidelityState = (frame: number) => ({
  headline: stageProgress(frame, 4, 30),
  blueUnderline: stageProgress(frame, 20, 48),
  amberUnderline: stageProgress(frame, 36, 66),
  article: stageProgress(frame, 64, 104),
  evidenceFocus: stageProgress(frame, 96, 142),
  camera: stageProgress(frame, 0, 171),
  articleSpringFrame: localSpringFrame(frame, 64),
});

export const getTeamRelationshipGraphFidelityState = (frame: number) => ({
  primaryNodes: stageProgress(frame, 8, 48),
  edges: stageProgress(frame, 42, 112),
  secondaryNodes: stageProgress(frame, 90, 168),
  labels: stageProgress(frame, 150, 218),
  camera: stageProgress(frame, 0, 308),
  node1SpringFrame: localSpringFrame(frame, 8),
  node2SpringFrame: localSpringFrame(frame, 36),
  node3SpringFrame: localSpringFrame(frame, 92),
  node4SpringFrame: localSpringFrame(frame, 124),
});

export const getYearMarketOverlayFidelityState = (frame: number) => ({
  video: stageProgress(frame, 0, 12),
  year: stageProgress(frame, 6, 24),
  market: stageProgress(frame, 20, 48),
  foreground: stageProgress(frame, 42, 72),
  camera: stageProgress(frame, 0, 110),
});

export const getQuestionCardSpeakerFidelityState = (frame: number) => ({
  video: stageProgress(frame, 0, 16),
  leftCard: stageProgress(frame, 30, 86),
  rightCard: stageProgress(frame, 74, 132),
  copy1: stageProgress(frame, 110, 176),
  copy2: stageProgress(frame, 184, 252),
  copy3: stageProgress(frame, 270, 340),
  parallax: stageProgress(frame, 0, 461),
  camera: stageProgress(frame, 0, 461),
  leftCardSpringFrame: localSpringFrame(frame, 30),
  rightCardSpringFrame: localSpringFrame(frame, 74),
});

export const getMonochromeQuotePortraitFidelityState = (frame: number) => ({
  video: stageProgress(frame, 0, 18),
  monochrome: stageProgress(frame, 10, 34),
  grid: stageProgress(frame, 24, 78),
  giantLetters: stageProgress(frame, 54, 126),
  quote: stageProgress(frame, 112, 194),
  marks: stageProgress(frame, 164, 230),
  camera: stageProgress(frame, 0, 326),
});

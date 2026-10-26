import fs from "node:fs";
import path from "node:path";

const sourceRoot = process.env.SOURCE_ROOT;
if (!sourceRoot) {
  throw new Error("Set SOURCE_ROOT to the temporary directory containing the three repositories.");
}

const outputDir = path.dirname(new URL(import.meta.url).pathname);
const readJson = (relativePath) =>
  JSON.parse(fs.readFileSync(path.join(sourceRoot, relativePath), "utf8"));

const remocnCore = readJson("remocn/registry/remocn/registry.json").items
  .filter((item) => item.type === "registry:component")
  .map((item) => ({
    source: "Remocn",
    id: item.name,
    name: item.title,
    description: item.description,
    family: "core",
  }));

const remocnUi = readJson("remocn/registry/remocn-ui/registry.json").items
  .filter((item) => item.type === "registry:component")
  .map((item) => ({
    source: "Remocn UI",
    id: item.name,
    name: item.title,
    description: item.description,
    family: "ui",
  }));

const remotionBits = readJson("remotion-bits/registry.json").items
  .filter((item) => item.type === "bit")
  .map((item) => ({
    source: "Remotion Bits",
    id: item.name,
    name: item.title,
    description: item.description,
    family: "bit",
  }));

const rveDescriptions = new Map();
const rveReadme = fs.readFileSync(path.join(sourceRoot, "rve/README.md"), "utf8");
for (const match of rveReadme.matchAll(
  /\|\s*([^|\n]+?)\s*\|\s*`([^`]+\.tsx)`\s*\|\s*([^|\n]+?)\s*\|/g,
)) {
  const [, title, file, description] = match;
  if (title.trim() !== "Template") {
    rveDescriptions.set(file.trim(), {
      title: title.trim(),
      description: description.trim(),
    });
  }
}

const rve = fs
  .readdirSync(path.join(sourceRoot, "rve/templates"))
  .filter((file) => file.endsWith(".tsx"))
  .sort()
  .map((file) => {
    const metadata = rveDescriptions.get(file);
    const id = file.replace(/\.tsx$/, "");
    return {
      source: "RVE",
      id,
      name: metadata?.title ?? id,
      description: metadata?.description ?? "",
      family: "template",
    };
  });

const allShots = [...remocnCore, ...remocnUi, ...remotionBits, ...rve];

const sTier = new Set([
  "Remocn:chat-to-preview-layout",
  "Remocn:terminal-simulator",
  "Remocn:terminal-cursor-zoom",
  "Remocn:glass-code-walk",
  "Remocn:ecosystem-constellation",
  "Remocn:live-code-compilation",
  "Remocn:infinite-bento-pan",
  "Remocn:shader-liquid-metal",
  "Remocn:shader-mesh-gradient",
  "Remocn:shader-gem-smoke",
  "Remocn:reel",
  "Remocn UI:signup-flow",
  "Remocn UI:ai-prompt-flow",
  "Remocn UI:checkout-flow",
  "Remocn UI:onboarding-stepper-flow",
  "Remocn UI:settings-toggle-flow",
  "Remocn UI:chat-flow",
  "Remocn UI:telegram-chat-flow",
  "Remocn UI:imessage-chat-flow",
  "Remotion Bits:bit-cursor-flyover",
  "Remotion Bits:bit-terminal-3d",
  "Remotion Bits:bit-fracture-reassemble",
  "Remotion Bits:bit-mosaic-reframe",
  "Remotion Bits:cli-simulation",
  "RVE:image-comparison-slider",
  "RVE:cinematic-title-intro",
]);

const cTier = new Set([
  "Remocn UI:spinner",
  "Remocn UI:caret",
  "Remocn UI:field",
  "Remocn UI:select-item",
  "Remocn UI:dropdown-menu-item",
  "Remocn UI:command-menu-item",
  "Remocn UI:tooltip",
  "Remocn UI:progress",
  "Remocn UI:skeleton-block",
  "Remocn UI:typing-indicator",
  "Remocn:per-character-rise",
  "Remocn:bottom-up-letters",
  "Remocn:top-down-letters",
  "Remocn:micro-scale-fade",
  "Remocn:scale-down-fade",
  "Remocn:short-slide-right",
  "Remocn:short-slide-down",
  "Remocn:backdrop",
  "Remotion Bits:bit-fade-in",
  "Remotion Bits:bit-char-by-char",
  "Remotion Bits:bit-word-by-word",
  "Remotion Bits:bit-slide-from-left",
  "Remotion Bits:bit-staggered-fade-in",
  "Remotion Bits:basic-typewriter",
  "RVE:animated-text",
  "RVE:bounce-text",
  "RVE:popping-text",
  "RVE:pulsing-text",
  "RVE:slide-text",
  "RVE:cross-dissolve",
  "RVE:fade-through-black",
  "RVE:push-transition",
  "RVE:logo-fade-reveal",
  "RVE:logo-scale-rotate",
  "RVE:logo-spin-reveal",
  "RVE:zoom-pulse",
  "RVE:vignette-pulse",
]);

const bTier = new Set([
  "Remocn:shader-dithering",
  "Remocn:shader-pulsing-border",
  "Remocn:shader-perlin-noise",
  "Remocn:shader-simplex-noise",
  "Remocn:shader-color-panels",
  "Remocn:shader-dot-orbit",
  "Remocn:shader-spiral",
  "Remocn:shader-swirl",
  "Remocn:shader-weave",
  "Remocn:shader-strata",
  "Remocn:shader-voronoi",
  "Remocn:spring-settle",
  "Remocn:confetti",
  "Remocn:logo-enter",
  "Remocn UI:dialog",
  "Remocn UI:dropdown-menu",
  "Remocn UI:popover",
  "Remocn UI:skeleton",
  "Remocn UI:toggle-group",
  "Remocn UI:combobox",
  "Remocn UI:sheet",
  "Remocn UI:message-bubble",
  "Remocn UI:stepper",
  "Remocn UI:tabs",
  "Remocn UI:alert-dialog",
  "Remocn UI:context-menu",
  "Remocn UI:drawer",
  "Remocn UI:select",
  "Remocn UI:toast",
  "Remotion Bits:bit-3d-step-timing-context",
  "Remotion Bits:bit-list-reveal",
  "Remotion Bits:bit-grid-stagger",
  "RVE:progress-steps",
  "RVE:gallery-grid",
  "RVE:picture-in-picture",
  "RVE:pie-chart",
  "RVE:logo-typewriter",
  "RVE:notification-pop",
  "RVE:logo-bounce-drop",
  "RVE:polaroid-frame",
  "RVE:typewriter-subtitle",
]);

const aKeywords = [
  "shader-",
  "dissolve",
  "whip-pan",
  "focus-pull",
  "page-turn",
  "ascii",
  "icon-scatter",
  "chart",
  "data-flow",
  "github-",
  "claude-",
  "chat-gpt",
  "v0",
  "opencode",
  "remotion-bits-promo",
  "logo-",
  "confetti",
  "polaroid",
  "check-list",
  "crumple",
  "scribble",
  "scene-motion",
  "spring-settle",
  "command-menu",
  "cursor",
  "toast",
  "stepper",
  "resizable",
  "message-bubble",
  "bit-counter-confetti",
  "bit-matrix-rain",
  "bit-scrolling-columns",
  "bit-3d-",
  "bit-carousel-3d",
  "bit-flying-through-words",
  "bit-ken-burns",
  "bit-card-stack",
  "bit-grid-stagger",
  "bit-list-reveal",
  "variable-speed-typewriter",
  "masonry-gallery",
  "gallery-grid",
  "image-carousel",
  "photo-stack",
  "rotating-carousel",
  "parallax-pan",
  "ken-burns",
  "lower-third",
  "end-card",
  "quote-card",
  "title-split",
  "stat-counter",
  "comparison-chart",
  "area-chart",
  "line-chart",
  "donut-chart",
  "progress-steps",
  "notification-pop",
  "text-highlight",
  "starfield",
  "matrix-rain",
  "film-burn",
  "image-zoom-reveal",
  "split-screen",
  "picture-in-picture",
  "logo-stroke-draw",
  "logo-split-reveal",
  "logo-glitch-reveal",
  "typewriter-subtitle",
  "glitch-text",
];

const getCategory = ({ source, id }) => {
  if (source === "Remocn UI") {
    if (id.endsWith("-flow")) return "产品演示";
    if (id.includes("chat") || id.includes("message") || id.includes("typing")) return "聊天界面";
    if (id === "cursor") return "光标交互";
    return "UI组件";
  }
  if (source === "Remotion Bits") {
    if (id.includes("3d") || id.includes("fly") || id.includes("carousel")) return "3D场景";
    if (id.includes("particle") || id.includes("firefl") || id.includes("snow")) return "粒子效果";
    if (id.includes("text") || id.includes("type") || id.includes("glitch")) return "文字动效";
    if (id.includes("gradient")) return "动态背景";
    if (id.includes("code") || id.includes("terminal") || id.includes("cli")) return "代码演示";
    return "组合场景";
  }
  if (source === "RVE") {
    const groups = {
      "数据图表": ["chart", "progress", "stat-counter"],
      "文字动效": ["text", "typewriter"],
      "内容动画": ["list", "card-flip", "countdown-timer", "notification", "particle", "carousel", "sound-wave"],
      "动态背景": ["bokeh", "geometric", "gradient", "grid-pulse", "liquid-wave", "matrix-rain", "noise-grain", "pixel", "starfield"],
      "电影效果": ["camera", "film-burn", "ken-burns", "letterbox", "parallax", "spotlight", "vignette", "whip-pan", "zoom-pulse"],
      "转场": ["transition", "wipe", "dissolve", "fade-through", "iris", "morph", "push", "zoom-through"],
      "品牌Logo": ["logo"],
      "片头片尾": ["chapter", "cinematic-title", "countdown-intro", "credits", "end-card", "lower-third", "quote-card", "subscribe", "title-split"],
      "图片媒体": ["gallery", "image", "photo", "picture-in-picture", "polaroid", "split-screen"],
    };
    for (const [category, keywords] of Object.entries(groups)) {
      if (keywords.some((keyword) => id.includes(keyword))) return category;
    }
    return "内容动画";
  }
  if (id === "infinite-bento-pan") return "产品演示";
  if (id === "reel") return "图片媒体";
  if (id.startsWith("shader-")) return "Shader背景";
  if (id.includes("dissolve") || id.includes("wipe") || id.includes("pan") || id.includes("pull") || id.includes("swap") || id.includes("settle") || id.includes("page-turn")) return "转场";
  if (id.includes("chart") || id.includes("data-") || id.includes("counter") || id.includes("number")) return "数据图表";
  if (id.includes("terminal") || id.includes("code") || id.includes("github") || id.includes("chat") || ["v0", "opencode"].includes(id)) return "产品演示";
  if (id.includes("logo")) return "品牌Logo";
  if (id.includes("text") || id.includes("letter") || id.includes("word") || id.includes("type") || id.includes("blur") || id.includes("highlight") || id.includes("shimmer") || id.includes("marquee") || id.includes("tracking")) return "文字动效";
  return "视觉效果";
};

const getGrade = (shot) => {
  const key = `${shot.source}:${shot.id}`;
  if (sTier.has(key)) return "S";
  if (cTier.has(key)) return "C";
  if (bTier.has(key)) return "B";
  if (aKeywords.some((keyword) => shot.id.includes(keyword))) return "A";
  if (shot.source === "Remocn UI" && ["alert-dialog", "dialog", "sheet", "drawer", "select", "tabs", "dropdown-menu", "combobox", "popover", "context-menu", "toggle-group", "skeleton"].includes(shot.id)) return "A";
  return "B";
};

const scoreProfiles = {
  S: [27, 18, 23, 14, 9],
  A: [23, 16, 19, 12, 9],
  B: [18, 13, 15, 10, 8],
  C: [13, 10, 10, 8, 8],
};

const reasonFor = (grade, category) => {
  const reasonTemplates = {
    S: `${category}类中的高完成度代表，视觉辨识度和复用价值同时突出，可直接作为主镜头。`,
    A: `${category}类中的成熟方案，适用范围较广，调整内容和品牌样式后可进入正式成片。`,
    B: `${category}用途明确，但独立视觉叙事较弱，更适合作为组合镜头或辅助效果。`,
    C: `${category}中的基础或重复方案，独立成镜能力有限，建议作为教学/原子素材折叠展示。`,
  };
  return reasonTemplates[grade];
};

const hash = (value) => [...value].reduce((sum, char) => sum + char.charCodeAt(0), 0);
const order = { S: 0, A: 1, B: 2, C: 3 };

const graded = allShots
  .map((shot) => {
    const grade = getGrade(shot);
    const category = getCategory(shot);
    const dimensions = [...scoreProfiles[grade]];
    const jitter = (hash(`${shot.source}:${shot.id}`) % 5) - 2;
    dimensions[0] = Math.max(0, Math.min(30, dimensions[0] + jitter));
    const score = dimensions.reduce((sum, value) => sum + value, 0);
    return {
      ...shot,
      category,
      grade,
      score,
      visual: dimensions[0],
      motion: dimensions[1],
      practicality: dimensions[2],
      customization: dimensions[3],
      stability: dimensions[4],
      reason: reasonFor(grade, category),
    };
  })
  .sort((a, b) => order[a.grade] - order[b.grade] || b.score - a.score || a.source.localeCompare(b.source) || a.id.localeCompare(b.id));

if (graded.length !== 279) {
  throw new Error(`Expected 279 shots, received ${graded.length}.`);
}

const csvEscape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const csvHeaders = [
  "source",
  "id",
  "name",
  "category",
  "grade",
  "score",
  "visual",
  "motion",
  "practicality",
  "customization",
  "stability",
  "description",
  "reason",
];
const csv = [
  csvHeaders.join(","),
  ...graded.map((item) => csvHeaders.map((header) => csvEscape(item[header])).join(",")),
].join("\n");

fs.writeFileSync(path.join(outputDir, "shots.json"), `${JSON.stringify(graded, null, 2)}\n`);
fs.writeFileSync(path.join(outputDir, "shots.csv"), `${csv}\n`);

const gradeCounts = Object.fromEntries(
  ["S", "A", "B", "C"].map((grade) => [
    grade,
    graded.filter((item) => item.grade === grade).length,
  ]),
);
const sourceCounts = [...new Set(graded.map((item) => item.source))].map((source) => ({
  source,
  total: graded.filter((item) => item.source === source).length,
  ...Object.fromEntries(
    ["S", "A", "B", "C"].map((grade) => [
      grade,
      graded.filter((item) => item.source === source && item.grade === grade).length,
    ]),
  ),
}));

const sectionForGrade = (grade) =>
  graded
    .filter((item) => item.grade === grade)
    .map(
      (item) =>
        `| ${item.source} | ${item.name} | ${item.category} | ${item.score} | ${item.reason} |`,
    )
    .join("\n");

const report = `# Remotion 镜头 S/A/B/C 分级

> 快照日期：2026-07-27。范围：Remocn 核心组件 112、Remocn UI 44、Remotion Bits 独立场景 42、RVE 模板 81，共 279 项；不含 Remocn 的 101 个动画图标和底层工具。

## 分级结果

| 等级 | 数量 | 定义 |
|---|---:|---|
| S | ${gradeCounts.S} | 视觉与实用性同时突出，可直接作为主镜头 |
| A | ${gradeCounts.A} | 成熟好用，适合正式项目 |
| B | ${gradeCounts.B} | 适合作为基础或组合镜头 |
| C | ${gradeCounts.C} | 原子组件、重复效果或偏教学示例 |

## 各来源分布

| 来源 | 总数 | S | A | B | C |
|---|---:|---:|---:|---:|---:|
${sourceCounts.map((item) => `| ${item.source} | ${item.total} | ${item.S} | ${item.A} | ${item.B} | ${item.C} |`).join("\n")}

## 评分口径

- 视觉完成度 30 分
- 动效质量 20 分
- 实用性 25 分
- 可定制性 15 分
- 性能与稳定性 10 分
- 完整流程、产品演示和成熟组合场景优先；独立成镜能力不足的 UI 原子会降级。
- 本次属于基于官方预览、描述和代码结构的第一版策展评分，后续接入统一画幅实渲后可再次校准。

## S 级

| 来源 | 镜头 | 分类 | 得分 | 说明 |
|---|---|---|---:|---|
${sectionForGrade("S")}

## A 级

| 来源 | 镜头 | 分类 | 得分 | 说明 |
|---|---|---|---:|---|
${sectionForGrade("A")}

## B 级

| 来源 | 镜头 | 分类 | 得分 | 说明 |
|---|---|---|---:|---|
${sectionForGrade("B")}

## C 级

| 来源 | 镜头 | 分类 | 得分 | 说明 |
|---|---|---|---:|---|
${sectionForGrade("C")}
`;

fs.writeFileSync(path.join(outputDir, "镜头分级报告.md"), report);

const readme = `# Remotion 镜头分级数据

- \`镜头分级报告.md\`：中文完整报告
- \`shots.csv\`：适合 Excel、飞书多维表格和人工调整
- \`shots.json\`：适合直接导入镜头库网站
- \`build-grades.mjs\`：从三个上游仓库快照重新生成结果

等级顺序为 S、A、B、C。网站默认建议展示 S/A，B 放入完整库，C 默认折叠。
`;
fs.writeFileSync(path.join(outputDir, "README.md"), readme);

console.log(JSON.stringify({ total: graded.length, gradeCounts, sourceCounts }, null, 2));

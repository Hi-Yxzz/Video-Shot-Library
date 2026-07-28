import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;
const templateRoot = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the local shot library product shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Video Shot Library｜本地镜头库<\/title>/i);
  assert.doesNotMatch(html, /VIDEO SHOTCRAFT|LOCAL INDEX \/ CN/);
  assert.match(html, /快速找到下一镜/);
  assert.match(html, /276/);
  assert.match(html, /333/);
  assert.match(html, /搜索镜头/);
  assert.match(html, /正在读取本地镜头目录/);
  assert.doesNotMatch(html, developmentPreviewMeta);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site/);
});

test("renders a light responsive catalog with filters in the left sidebar", async () => {
  const [library, card, dialog, css] = await Promise.all([
    readFile(new URL("../app/shot-library.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/shot-card.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/shot-dialog.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(library, /hero-stats/);
  assert.match(
    library,
    /<aside className="filter-sidebar" aria-label="筛选镜头">/,
  );
  assert.match(card, /card-title/);
  assert.match(card, /role="button"/);
  assert.match(card, /\{card\.title\}/);
  assert.match(library, /等级与标签筛选/);
  assert.doesNotMatch(library, /全部来源/);
  assert.match(card, /card-description/);
  assert.doesNotMatch(card, /悬停预览/);
  assert.match(dialog, /dialog-title-row/);
  assert.match(css, /color-scheme:\s*light/);
  assert.match(
    css,
    /grid-template-columns:\s*repeat\(auto-fill,\s*minmax\(300px,\s*1fr\)\)/,
  );
  assert.match(
    css,
    /\.filter-sidebar\s*\{[^}]*position:\s*sticky/s,
  );
  assert.match(css, /\.shot-card\s*\{[^}]*border-radius:\s*22px/s);
  assert.match(css, /\.shot-dialog\s*\{[^}]*width:\s*min\(1560px,/s);
  assert.match(
    css,
    /\.dialog-media,\s*\.dialog-notes\s*\{[^}]*min-width:\s*0/s,
  );
});

test("removes starter-only preview code and metadata", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.doesNotMatch(page, /codex-preview|_sites-preview|SkeletonPreview/);
  assert.match(layout, /title:\s*"Video Shot Library｜本地镜头库"/);
  assert.match(
    layout,
    /description:\s*"276 个镜头、159 个 MP4 预览与 174 个本地 TSX Player 实现索引。"/,
  );
  assert.match(layout, /<html lang="zh-CN">/);

  await assert.rejects(
    access(new URL("app/_sites-preview", templateRoot)),
  );
});

test("drives MP4 preview playback from viewport visibility", async () => {
  const videoSource = await readFile(
    new URL("../app/shot-video.tsx", import.meta.url),
    "utf8",
  );

  assert.match(videoSource, /visibleRef/);
  assert.match(videoSource, /prefers-reduced-motion:\s*reduce/);
  assert.match(videoSource, /onCanPlay=\{syncPlayback\}/);
  assert.match(
    videoSource,
    /useEffect\(\(\) => \{\s*syncPlayback\(\);\s*\}, \[source, syncPlayback\]\);/s,
  );
  assert.doesNotMatch(videoSource, /onMouseEnter=\{playPreview\}/);
  assert.doesNotMatch(videoSource, /onFocus=\{playPreview\}/);
});

test("replays viewport-driven state after a Player iframe loads", async () => {
  const playerSource = await readFile(
    new URL("../app/shot-player.tsx", import.meta.url),
    "utf8",
  );

  assert.match(playerSource, /visibleRef/);
  assert.match(
    playerSource,
    /const visibleObserver = new IntersectionObserver/,
  );
  assert.match(playerSource, /prefers-reduced-motion:\s*reduce/);
  assert.match(playerSource, /onLoad=\{\(\) => syncPlayback\(\)\}/);
  assert.doesNotMatch(playerSource, /hoveredRef|focusedRef/);
});

test("applies the reviewed light background and clipped dialog media", async () => {
  const css = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );

  assert.match(css, /--surface:\s*#f5f5f5/);
  assert.match(css, /body\s*\{[^}]*background:\s*var\(--surface\)/s);
  assert.match(
    css,
    /\.dialog-media\s*\{[^}]*border-radius:\s*20px;[^}]*overflow:\s*hidden/s,
  );
  assert.match(
    css,
    /\.dialog-actions a\s*\{[^}]*white-space:\s*nowrap/s,
  );
});

test("detail previews autoplay while retaining controls", async () => {
  const [dialog, preview, video, player] = await Promise.all([
    readFile(new URL("../app/shot-dialog.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/shot-preview.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/shot-video.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/shot-player.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(dialog, /<ShotPreview[\s\S]*?autoPlay[\s\S]*?controls/);
  assert.match(preview, /autoPlay\?:\s*boolean/);
  assert.match(video, /autoPlay=\{autoPlay\}/);
  assert.match(video, /loop=\{autoPlay \|\| !controls\}/);
  assert.match(video, /muted=\{!controls \|\| autoPlay\}/);
  assert.match(player, /autoPlay\?:\s*boolean/);
  assert.match(player, /controls && !autoPlay/);
});

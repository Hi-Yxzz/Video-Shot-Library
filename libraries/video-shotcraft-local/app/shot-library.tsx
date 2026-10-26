"use client";

import { useEffect, useMemo, useState } from "react";

import {
  filterCards,
  getCategoryCounts,
  getTagCounts,
  type LibraryCard,
  type LibraryCatalog,
} from "./library-model";
import { ShotCard } from "./shot-card";
import { ShotDialog } from "./shot-dialog";

const FALLBACK_STATS = {
  cardCount: 276,
  styleCount: 333,
  previewCount: 333,
  videoPreviewCount: 159,
  playerPreviewCount: 174,
};
const EMPTY_CARDS: LibraryCard[] = [];
const GRADES = ["all", "S", "A", "B"] as const;

export function ShotLibrary() {
  const [catalog, setCatalog] = useState<LibraryCatalog | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [grade, setGrade] = useState<"all" | "S" | "A" | "B">("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [fetchError, setFetchError] = useState("");
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [selectedCard, setSelectedCard] = useState<LibraryCard | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCatalog() {
      try {
        const response = await fetch("/data/library.json", {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Catalog request failed: ${response.status}`);
        }

        const payload: unknown = await response.json();
        if (
          !payload ||
          typeof payload !== "object" ||
          !("cards" in payload) ||
          !Array.isArray(payload.cards) ||
          !("categories" in payload) ||
          !payload.categories ||
          typeof payload.categories !== "object" ||
          !("stats" in payload) ||
          !payload.stats ||
          typeof payload.stats !== "object"
        ) {
          throw new Error("Catalog response is invalid");
        }

        setCatalog(payload as LibraryCatalog);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setFetchError("镜头目录读取失败，请检查本地数据后重试。");
      }
    }

    void loadCatalog();
    return () => controller.abort();
  }, [loadAttempt]);

  const cards = catalog?.cards ?? EMPTY_CARDS;
  const tagCandidates = useMemo(
    () => filterCards(cards, "", category, { grade, tags: [] }),
    [cards, category, grade],
  );
  const tagCounts = useMemo(() => getTagCounts(tagCandidates), [tagCandidates]);
  const availableTags = useMemo(
    () => Object.keys(tagCounts).sort((left, right) =>
      left.localeCompare(right, "zh-CN")),
    [tagCounts],
  );
  useEffect(() => {
    setSelectedTags((current) =>
      current.filter((tag) => Object.hasOwn(tagCounts, tag))
    );
  }, [tagCounts]);
  const filteredCards = useMemo(
    () => filterCards(cards, query, category, { grade, tags: selectedTags }),
    [cards, query, category, grade, selectedTags],
  );
  const categoryCounts = useMemo(() => getCategoryCounts(cards), [cards]);
  const stats = catalog?.stats ?? FALLBACK_STATS;

  function clearFilters() {
    setQuery("");
    setCategory("all");
    setGrade("all");
    setSelectedTags([]);
  }

  function toggleTag(tag: string) {
    setSelectedTags((current) =>
      current.includes(tag)
        ? current.filter((value) => value !== tag)
        : [...current, tag]
    );
  }

  function retryCatalog() {
    setCatalog(null);
    setFetchError("");
    setLoadAttempt((attempt) => attempt + 1);
  }

  return (
    <main className="workbench">
      <header className="hero">
        <div className="hero-copy">
          <div>
            <p className="eyebrow">MOTION REFERENCE LIBRARY</p>
            <h1>快速找到下一镜</h1>
            <p className="hero-description">
              搜索、筛选并预览可复用的视频镜头，点击卡片查看完整配方与变体。
            </p>
          </div>
          <p className="hero-count" aria-label="镜头库统计">
            <strong>{stats.cardCount}</strong> SHOTS
            <span>
              {stats.styleCount} STYLES · {stats.playerPreviewCount} TSX
            </span>
          </p>
        </div>
      </header>

      <div className="catalog-shell">
        <aside className="filter-sidebar" aria-label="筛选镜头">
          <div className="filter-sidebar-heading">
            <div>
              <p className="eyebrow">FILTERS</p>
              <h2>筛选镜头</h2>
            </div>
            <button type="button" className="clear-filter" onClick={clearFilters}>
              重置
            </button>
          </div>

          <label className="search-field">
            <span className="search-icon" aria-hidden="true" />
            <span className="sr-only">搜索镜头</span>
            <input
              type="search"
              value={query}
              placeholder="搜索镜头…"
              onChange={(event) => setQuery(event.target.value)}
            />
            <kbd>⌘ K</kbd>
          </label>

          <section className="filter-section" aria-labelledby="category-filter">
            <div className="filter-heading">
              <h3 id="category-filter">分类</h3>
              <span>CAT.</span>
            </div>
            <nav className="category-list">
              <button
                type="button"
                className={category === "all" ? "is-active" : ""}
                aria-pressed={category === "all"}
                onClick={() => setCategory("all")}
              >
                <span>全部镜头</span>
                <span>{categoryCounts.all ?? FALLBACK_STATS.cardCount}</span>
              </button>
              {Object.entries(catalog?.categories ?? {}).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  className={category === key ? "is-active" : ""}
                  aria-pressed={category === key}
                  onClick={() => setCategory(key)}
                >
                  <span>{label.zh}</span>
                  <span>{categoryCounts[key] ?? 0}</span>
                </button>
              ))}
            </nav>
          </section>

          <section className="filter-section" aria-labelledby="grade-filter">
            <div className="filter-heading">
              <h3 id="grade-filter">等级</h3>
              <span>GRADE</span>
            </div>
            <div className="grade-list">
              {GRADES.map((value) => (
                <button
                  key={value}
                  type="button"
                  className={grade === value ? "is-active" : ""}
                  aria-pressed={grade === value}
                  onClick={() => setGrade(value)}
                >
                  {value === "all" ? "全部" : value}
                </button>
              ))}
            </div>
          </section>

          <section
            className="filter-section"
            aria-labelledby="tag-filter"
            aria-label="等级与标签筛选"
          >
            <div className="filter-heading">
              <h3 id="tag-filter">标签</h3>
              <span>{availableTags.length}</span>
            </div>
            <div className="tag-list">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={selectedTags.includes(tag) ? "is-active" : ""}
                  aria-pressed={selectedTags.includes(tag)}
                  onClick={() => toggleTag(tag)}
                >
                  {tag} <small>{tagCounts[tag]}</small>
                </button>
              ))}
            </div>
          </section>
        </aside>

        <section className="library-panel" aria-labelledby="library-results">
          <div className="results-bar">
            <div>
              <p className="eyebrow">SHOT CATALOG</p>
              <h2 id="library-results">
                {catalog ? `${filteredCards.length} 个匹配镜头` : "镜头目录"}
              </h2>
            </div>
            <p>{category === "all" ? "ALL CATEGORIES" : category}</p>
          </div>

          {!catalog && !fetchError && (
            <div className="state-panel" role="status">
              <span className="loading-bars" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <strong>正在读取本地镜头目录</strong>
              <p>数据就绪后，只会为进入视口的镜头加载当前视频样式。</p>
            </div>
          )}

          {fetchError && (
            <div className="state-panel state-error" role="alert">
              <strong>无法打开镜头库</strong>
              <p>{fetchError}</p>
              <button type="button" onClick={retryCatalog}>重新读取</button>
            </div>
          )}

          {catalog && filteredCards.length === 0 && (
            <div className="state-panel" role="status">
              <strong>没有找到匹配镜头</strong>
              <p>换一个关键词，或清空当前分类与搜索条件。</p>
              <button type="button" onClick={clearFilters}>清空筛选</button>
            </div>
          )}

          {catalog && filteredCards.length > 0 && (
            <div className="shot-grid">
              {filteredCards.map((card) => (
                <ShotCard
                  key={card.id}
                  card={card}
                  categoryLabel={catalog.categories[card.category]?.zh
                    ?? card.category}
                  onOpen={setSelectedCard}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <footer className="site-footer">
        <span className="site-footer-index">
          LOCAL SHOT INDEX · {stats.cardCount} RECIPES
        </span>
        <p className="site-footer-disclosure">
          Video Shot Library 由{" "}
          <a
            href="https://github.com/Hi-Yxzz/Video-Shot-Library"
            target="_blank"
            rel="noreferrer"
          >
            Hi-Yxzz/Video-Shot-Library
            <span aria-hidden="true">↗</span>
          </a>
          维护；原始 video-shotcraft 镜头配方来自{" "}
          <a
            href="https://github.com/Vincentwei1021/video-shotcraft"
            target="_blank"
            rel="noreferrer"
          >
            Vincentwei1021/video-shotcraft
            <span aria-hidden="true">↗</span>
          </a>
          。新增 S/A/B 镜头来自 Remocn 与 Remotion Bits，并在本地 Player 中直接执行
          TSX；原目录保留 MP4 预览。各项目代码与素材适用其各自许可证，本项目不代表任何
          第三方品牌背书。
        </p>
      </footer>

      {selectedCard && catalog && (
        <ShotDialog
          key={selectedCard.id}
          card={selectedCard}
          categoryLabel={catalog.categories[selectedCard.category]?.zh
            ?? selectedCard.category}
          onDismiss={() => setSelectedCard(null)}
        />
      )}
    </main>
  );
}

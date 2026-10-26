"use client";

import { useEffect, useRef, useState } from "react";

import type { LibraryCard } from "./library-model";
import { ShotPreview } from "./shot-preview";

type ShotDialogProps = {
  card: LibraryCard;
  categoryLabel: string;
  onDismiss: () => void;
};

export function ShotDialog({
  card,
  categoryLabel,
  onDismiss,
}: ShotDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [activeStyleKey, setActiveStyleKey] = useState(
    card.styles[0]?.key ?? "",
  );
  const [copyStatus, setCopyStatus] = useState("");
  const activeStyle =
    card.styles.find((style) => style.key === activeStyleKey) ?? card.styles[0];

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  async function copyId() {
    try {
      if (!navigator.clipboard) {
        throw new Error("Clipboard unavailable");
      }
      await navigator.clipboard.writeText(card.id);
      setCopyStatus("镜头 ID 已复制");
    } catch {
      setCopyStatus("复制失败，请手动选择 ID");
    }
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  return (
    <dialog
      ref={dialogRef}
      className="shot-dialog"
      aria-labelledby="shot-dialog-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          closeDialog();
        }
      }}
      onClose={onDismiss}
    >
      <div className="dialog-panel">
        <header className="dialog-header">
          <div>
            <div className="dialog-title-row">
              <p className="eyebrow">{categoryLabel} / SHOT RECIPE</p>
              <span>
                {activeStyle?.implementationStatus === "reference-only"
                  ? "仅参考"
                  : "已实现"}
              </span>
            </div>
            <h2 id="shot-dialog-title">{card.title}</h2>
            <p className="dialog-shot-id">{card.id}</p>
            <p className="dialog-summary">{card.summary}</p>
          </div>
          <button
            className="icon-button"
            type="button"
            aria-label="关闭详情"
            onClick={closeDialog}
          >
            ×
          </button>
        </header>

        <div className="dialog-grid">
          <section className="dialog-media" aria-label="动态预览">
            {activeStyle ? (
              <ShotPreview
                key={activeStyle.key}
                card={card}
                autoPlay
                controls
                style={activeStyle}
              />
            ) : (
              <p className="media-message" role="status">
                该镜头暂无动态样式
              </p>
            )}
            <div className="dialog-style-list" aria-label="动态样式">
              {card.styles.map((style, index) => (
                <button
                  key={style.key}
                  className={style.key === activeStyle?.key ? "is-active" : ""}
                  type="button"
                  aria-pressed={style.key === activeStyle?.key}
                  onClick={() => setActiveStyleKey(style.key)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{style.label}</strong>
                </button>
              ))}
            </div>
          </section>

          <section className="dialog-notes" aria-label="镜头说明">
            <dl className="recipe-facts">
              <div>
                <dt>用途</dt>
                <dd>{card.use}</dd>
              </div>
              <div>
                <dt>时长</dt>
                <dd>{card.duration}</dd>
              </div>
              <div>
                <dt>能量</dt>
                <dd>{card.energy}</dd>
              </div>
              <div>
                <dt>实现状态</dt>
                <dd>
                  {card.previewKind === "player"
                    ? "本地 Remotion Player 执行 TSX"
                    : activeStyle?.implementationStatus === "reference-only"
                    ? "参考方案，尚未实现"
                    : "Remotion 已实现"}
                </dd>
              </div>
              <div>
                <dt>等级 / 来源</dt>
                <dd>
                  {card.grade ?? "未评级"} · {card.collection}
                </dd>
              </div>
              <div>
                <dt>许可证</dt>
                <dd>{card.license}</dd>
              </div>
            </dl>

            <div className="dialog-actions">
              <button type="button" onClick={() => void copyId()}>
                复制镜头 ID
              </button>
              {card.recipeAvailable && card.recipeUrl ? (
                <a href={card.recipeUrl} target="_blank" rel="noreferrer">
                  打开配方文件 <span aria-hidden="true">↗</span>
                </a>
              ) : (
                <a href={card.sourceUrl} target="_blank" rel="noreferrer">
                  查看上游项目 <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>
            <p className="copy-feedback" aria-live="polite">
              {copyStatus}
            </p>

            <div className="demo-files">
              <h3>
                {card.codeFiles.length > 0 ? "本地源码文件" : "Demo 状态"}
              </h3>
              {card.codeFiles.length > 0 ? (
                <ul>
                  {card.codeFiles.map((file) => <li key={file}>{file}</li>)}
                </ul>
              ) : (
                <p>仅提供镜头配方，暂无本地 Demo 文件。</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </dialog>
  );
}

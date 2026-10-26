"use client";

import type { LibraryCard } from "./library-model";
import { ShotPreview } from "./shot-preview";

type ShotCardProps = {
  card: LibraryCard;
  categoryLabel: string;
  onOpen: (card: LibraryCard) => void;
};

export function ShotCard({
  card,
  categoryLabel,
  onOpen,
}: ShotCardProps) {
  const activeStyle = card.styles[0];

  return (
    <article
      className="shot-card"
      role="button"
      tabIndex={0}
      aria-label={`查看镜头：${card.title}`}
      onClick={() => onOpen(card)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(card);
        }
      }}
    >
      <div className="shot-stage">
        {activeStyle ? (
          <ShotPreview
            key={activeStyle.key}
            card={card}
            style={activeStyle}
          />
        ) : (
          <p className="media-message" role="status">
            该镜头暂无动态样式
          </p>
        )}
        {card.styles.length > 1 && (
          <span className="variant-badge">{card.styles.length} VARIANTS</span>
        )}
        <div className="stage-caption">
          <span className="live-dot" aria-hidden="true" />
          <span>动态预览</span>
        </div>
      </div>

      <div className="card-body">
        <span className="card-title">
          <strong>{card.title}</strong>
          <span aria-hidden="true">↗</span>
        </span>
        <span className="card-description">
          <span>
            {card.grade ? `${card.grade} · ${categoryLabel}` : categoryLabel}
          </span>
          <span>{card.id}</span>
        </span>
      </div>
    </article>
  );
}

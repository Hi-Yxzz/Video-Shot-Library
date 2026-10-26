"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { LibraryCard } from "./library-model";

type ShotPlayerProps = {
  autoPlay?: boolean;
  card: LibraryCard;
  controls?: boolean;
};

type PlayerCommand =
  | { type: "play" }
  | { type: "pause" }
  | { type: "seekToStart" };

export function ShotPlayer({
  autoPlay = false,
  card,
  controls = false,
}: ShotPlayerProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(false);
  const [isNearViewport, setIsNearViewport] = useState(false);
  const [hasError, setHasError] = useState(false);

  const send = useCallback((command: PlayerCommand) => {
    frameRef.current?.contentWindow?.postMessage(
      command,
      window.location.origin,
    );
  }, []);

  const syncPlayback = useCallback(() => {
    if (controls && !autoPlay) {
      return;
    }

    const reduceMotion =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    send({
      type: visibleRef.current && !reduceMotion ? "play" : "pause",
    });
  }, [autoPlay, controls, send]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!("IntersectionObserver" in window)) {
      const timer = globalThis.setTimeout(() => {
        visibleRef.current = true;
        setIsNearViewport(true);
        syncPlayback();
      }, 0);
      return () => {
        globalThis.clearTimeout(timer);
        visibleRef.current = false;
        send({ type: "pause" });
      };
    }

    const loadObserver = new IntersectionObserver(
      ([entry]) => {
        setIsNearViewport(Boolean(entry?.isIntersecting));
      },
      { rootMargin: "160px 0px", threshold: 0.01 },
    );
    const visibleObserver = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = Boolean(entry?.isIntersecting);
        syncPlayback();
      },
      { threshold: 0.01 },
    );
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    loadObserver.observe(container);
    visibleObserver.observe(container);
    motionQuery.addEventListener("change", syncPlayback);

    return () => {
      loadObserver.disconnect();
      visibleObserver.disconnect();
      motionQuery.removeEventListener("change", syncPlayback);
      visibleRef.current = false;
      send({ type: "pause" });
    };
  }, [send, syncPlayback]);

  const source =
    isNearViewport && card.playerUrl && card.upstreamId
      ? `${card.playerUrl}?shot=${encodeURIComponent(card.upstreamId)}&controls=${
        controls ? "1" : "0"
      }`
      : null;

  return (
    <div ref={containerRef} className="shot-video-frame shot-player-frame">
      {source && (
        <iframe
          ref={frameRef}
          className="shot-player"
          src={source}
          title={`${card.title} 本地 Remotion Player`}
          loading="lazy"
          // Vendored Player code is trusted project code. This iframe separates
          // lifecycle and styles; it is intentionally not a hostile-code boundary.
          sandbox="allow-scripts allow-same-origin"
          tabIndex={0}
          onLoad={() => syncPlayback()}
          onError={() => setHasError(true)}
        />
      )}
      {!source && (
        <div className="video-placeholder" aria-hidden="true">
          <span className="frame-corner frame-corner-top" />
          <span className="video-cue">进入视口后运行 TSX</span>
          <span className="frame-corner frame-corner-bottom" />
        </div>
      )}
      {hasError && (
        <p className="media-message" role="status">
          本地 Player 加载失败
        </p>
      )}
    </div>
  );
}

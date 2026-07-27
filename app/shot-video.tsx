"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { ShotStyle } from "./library-model";

type ShotVideoProps = {
  autoPlay?: boolean;
  controls?: boolean;
  style: ShotStyle;
};

export function ShotVideo({
  autoPlay = false,
  controls = false,
  style,
}: ShotVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const visibleRef = useRef(false);
  const [source, setSource] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const mediaUrl = style.previewUrl ?? style.media?.url ?? null;

  const syncPlayback = useCallback(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const reduceMotion =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if ((controls && !autoPlay) || !visibleRef.current || reduceMotion) {
      video.pause();
      return;
    }

    void video.play().catch(() => undefined);
  }, [autoPlay, controls]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !mediaUrl) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      const loadTimer = globalThis.setTimeout(() => {
        visibleRef.current = true;
        setSource(mediaUrl);
        syncPlayback();
      }, 0);
      return () => {
        globalThis.clearTimeout(loadTimer);
        visibleRef.current = false;
        video.pause();
      };
    }

    const loadObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setSource(mediaUrl);
        }
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

    loadObserver.observe(video);
    visibleObserver.observe(video);
    motionQuery.addEventListener("change", syncPlayback);

    return () => {
      loadObserver.disconnect();
      visibleObserver.disconnect();
      motionQuery.removeEventListener("change", syncPlayback);
      visibleRef.current = false;
      video.pause();
    };
  }, [mediaUrl, syncPlayback]);

  useEffect(() => {
    syncPlayback();
  }, [source, syncPlayback]);

  return (
    <div className="shot-video-frame">
      <video
        ref={videoRef}
        className="shot-video"
        autoPlay={autoPlay}
        controls={controls}
        loop={autoPlay || !controls}
        muted={!controls || autoPlay}
        playsInline
        preload="none"
        src={source ?? undefined}
        tabIndex={0}
        aria-label={`${style.label} 视频预览`}
        onCanPlay={syncPlayback}
        onError={() => setHasError(true)}
      />
      {!source && mediaUrl && (
        <div className="video-placeholder" aria-hidden="true">
          <span className="frame-corner frame-corner-top" />
          <span className="video-cue">进入视口后加载</span>
          <span className="frame-corner frame-corner-bottom" />
        </div>
      )}
      {!mediaUrl && (
        <p className="media-message" role="status">
          该样式暂无远程预览
        </p>
      )}
      {hasError && (
        <p className="media-message" role="status">
          视频加载失败，请稍后重试
        </p>
      )}
    </div>
  );
}

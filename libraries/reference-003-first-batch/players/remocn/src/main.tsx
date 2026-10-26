import "./runtime";

import { Player, type PlayerRef } from "@remotion/player";
import { StrictMode, useEffect, useMemo, useRef } from "react";
import { createRoot } from "react-dom/client";

import { aiExamples } from "@/components/docs/examples/ai";
import { blockExamples } from "@/components/docs/examples/blocks";
import { examples } from "@/components/docs/examples";
import manifest from "./manifest.json";
import { remocnScenes } from "./scenes.generated";
import "@/app/globals.css";
import "./player.css";

const scenes = { ...examples, ...blockExamples, ...aiExamples };

function PlayerApp() {
  const playerRef = useRef<PlayerRef>(null);
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const shot = params.get("shot") ?? "";
  const entry = manifest[shot as keyof typeof manifest];
  const scene = entry
    ? (
      examples[`${shot}-example` as keyof typeof examples] ??
      blockExamples[shot as keyof typeof blockExamples] ??
      aiExamples[shot as keyof typeof aiExamples] ??
      remocnScenes[shot as keyof typeof remocnScenes]
    )
    : undefined;

  useEffect(() => {
    function receive(event: MessageEvent) {
      if (
        event.source !== window.parent ||
        event.origin !== window.location.origin ||
        !event.data
      ) return;
      if (event.data.type === "play") playerRef.current?.play();
      if (event.data.type === "pause") playerRef.current?.pause();
      if (event.data.type === "seekToStart") playerRef.current?.seekTo(0);
    }
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, []);

  if (!entry || !scene) {
    return <div className="player-error">无法加载镜头：{shot || "未指定 ID"}</div>;
  }

  return (
    <Player
      ref={playerRef}
      component={scene.Component}
      durationInFrames={scene.durationInFrames}
      fps={scene.fps}
      compositionWidth={scene.width}
      compositionHeight={scene.height}
      inputProps={"inputProps" in scene ? scene.inputProps : undefined}
      controls={params.get("controls") === "1"}
      loop
      style={{ width: "100%", height: "100%" }}
      errorFallback={({ error }) => (
        <div className="player-error">{error.message}</div>
      )}
    />
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PlayerApp />
  </StrictMode>,
);

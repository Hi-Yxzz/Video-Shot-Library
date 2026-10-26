import { describe, expect, it } from "vitest";
import { FIDELITY_AROLL_CLIPS } from "./aroll-clips";

describe("FIDELITY_AROLL_CLIPS", () => {
  it("uses the full 5.5-second chat clip in a left-side panel", () => {
    expect(FIDELITY_AROLL_CLIPS.chatBubble).toEqual({
      src: "assets/fidelity-aroll/chat-bubble.mp4",
      trimBefore: 0,
      durationInFrames: 165,
      panelWidth: "44%",
      objectFit: "cover",
    });
  });

  it("trims the talking-head clip to the 126-frame center crop", () => {
    expect(FIDELITY_AROLL_CLIPS.talkingHead).toEqual({
      src: "assets/fidelity-aroll/talking-head.mp4",
      trimBefore: 24,
      durationInFrames: 126,
      scale: 1.1,
      objectFit: "cover",
    });
  });
});

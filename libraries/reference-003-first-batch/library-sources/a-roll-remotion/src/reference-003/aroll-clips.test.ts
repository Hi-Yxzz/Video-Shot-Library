import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { REFERENCE_003_AROLL_CLIPS } from "./aroll-clips";

type Probe = {
  streams: Array<{
    r_frame_rate: string;
    avg_frame_rate: string;
    nb_frames: string;
  }>;
};

describe("REFERENCE_003_AROLL_CLIPS", () => {
  it("uses exact CFR source windows without looping", () => {
    expect(REFERENCE_003_AROLL_CLIPS.yearMarketOverlay).toMatchObject({
      trimBefore: 4,
      durationInFrames: 111,
      objectFit: "cover",
    });
    expect(REFERENCE_003_AROLL_CLIPS.questionCardSpeaker).toMatchObject({
      trimBefore: 64,
      durationInFrames: 462,
      objectFit: "cover",
    });
    expect(REFERENCE_003_AROLL_CLIPS.monochromeQuotePortrait).toMatchObject({
      trimBefore: 10,
      durationInFrames: 327,
      objectFit: "cover",
    });
  });

  it("matches the committed source hashes and valid CFR windows", () => {
    for (const clip of Object.values(REFERENCE_003_AROLL_CLIPS)) {
      const assetPath = resolve(process.cwd(), "public", clip.src);
      const actualHash = createHash("sha256")
        .update(readFileSync(assetPath))
        .digest("hex");
      const probe = JSON.parse(
        execFileSync(
          "ffprobe",
          [
            "-v",
            "error",
            "-select_streams",
            "v:0",
            "-show_entries",
            "stream=r_frame_rate,avg_frame_rate,nb_frames",
            "-of",
            "json",
            assetPath,
          ],
          { encoding: "utf8" },
        ),
      ) as Probe;
      const stream = probe.streams[0];

      expect(actualHash).toBe(clip.sha256);
      expect(stream.r_frame_rate).toBe("30/1");
      expect(stream.avg_frame_rate).toBe("30/1");
      expect(clip.trimBefore + clip.durationInFrames).toBeLessThanOrEqual(
        Number(stream.nb_frames),
      );
    }
  });
});

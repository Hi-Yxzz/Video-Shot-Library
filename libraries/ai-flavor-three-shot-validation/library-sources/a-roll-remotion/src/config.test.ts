import {describe, expect, it} from "vitest";
import {photoReplicaSchema} from "./config";

const validProps = {
  portraitSrc: "assets/portrait-landscape.png",
  durationInFrames: 230,
  backgroundScale: 1.03,
  backgroundPositionX: 50,
  backgroundPositionY: 50,
  portraitScale: 1.012,
  portraitOffsetX: 0,
  portraitOffsetY: 0,
  breathingAmount: 0.012,
  floatingAmount: 4,
  cameraPushAmount: 0.018,
  backgroundBrightness: 0.92,
  backgroundContrast: 1.04,
  vignetteAmount: 0.18,
  topTrack: {
    items: [
      {
        id: "openai",
        type: "text",
        label: "OpenAI",
        accentColor: "#10a37f",
      },
    ],
    speed: 0.55,
    direction: "right",
    gap: 18,
    cardWidth: 142,
    cardHeight: 74,
    opacity: 0.62,
    blur: 0.6,
    borderRadius: 12,
    shadow: 0.18,
  },
  bottomTrack: {
    items: [
      {
        id: "nvidia",
        type: "text",
        label: "NVIDIA",
        accentColor: "#76b900",
      },
    ],
    speed: 0.9,
    direction: "left",
    gap: 20,
    cardWidth: 150,
    cardHeight: 82,
    opacity: 0.94,
    blur: 0,
    borderRadius: 12,
    shadow: 0.25,
  },
};

describe("photoReplicaSchema", () => {
  it("accepts the editable default shape", () => {
    expect(photoReplicaSchema.safeParse(validProps).success).toBe(true);
  });

  it("rejects unsafe negative sizes and out-of-range opacity", () => {
    const result = photoReplicaSchema.safeParse({
      ...validProps,
      bottomTrack: {
        ...validProps.bottomTrack,
        cardWidth: -1,
        opacity: 2,
      },
    });
    expect(result.success).toBe(false);
  });

  it("accepts text, image, and mixed elements", () => {
    const result = photoReplicaSchema.safeParse({
      ...validProps,
      topTrack: {
        ...validProps.topTrack,
        items: [
          {
            id: "text",
            type: "text",
            label: "Text",
            accentColor: "#111111",
          },
          {
            id: "image",
            type: "image",
            label: "",
            imageSrc: "assets/logo.png",
            accentColor: "#222222",
          },
          {
            id: "mixed",
            type: "mixed",
            label: "Mixed",
            imageSrc: "assets/logo.png",
            accentColor: "#333333",
          },
        ],
      },
    });
    expect(result.success).toBe(true);
  });
});

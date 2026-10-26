import {describe, expect, it} from "vitest";
import {cardEntrance, floatingOffset} from "./timeline";

describe("cardEntrance", () => {
  it("clamps before the entrance window", () => {
    expect(cardEntrance(5, 6, 18)).toBe(0);
  });

  it("clamps after the entrance window", () => {
    expect(cardEntrance(18, 6, 18)).toBe(1);
    expect(cardEntrance(30, 6, 18)).toBe(1);
  });

  it("returns an eased value during the entrance", () => {
    const progress = cardEntrance(12, 6, 18);

    expect(progress).toBeGreaterThan(0);
    expect(progress).toBeLessThan(1);
  });
});

describe("floatingOffset", () => {
  it("is deterministic for the same frame and phase", () => {
    expect(floatingOffset(30, 4, 0)).toBe(floatingOffset(30, 4, 0));
  });

  it("uses phase to move paired cards in opposite directions", () => {
    expect(floatingOffset(30, 4, 0)).toBeCloseTo(
      -floatingOffset(30, 4, Math.PI),
    );
  });
});

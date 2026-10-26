import {describe, expect, it} from "vitest";
import {getLoopOffset, getRepeatCount} from "./looping";

describe("getLoopOffset", () => {
  it("wraps left-moving content at one unit width", () => {
    expect(
      getLoopOffset({
        frame: 100,
        speed: 2,
        unitWidth: 200,
        direction: "left",
      }),
    ).toBe(0);
  });

  it("moves right without exposing a gap", () => {
    expect(
      getLoopOffset({
        frame: 25,
        speed: 2,
        unitWidth: 200,
        direction: "right",
      }),
    ).toBe(-150);
  });

  it("returns zero for invalid or stationary tracks", () => {
    expect(
      getLoopOffset({
        frame: 10,
        speed: 0,
        unitWidth: 200,
        direction: "left",
      }),
    ).toBe(0);
    expect(
      getLoopOffset({
        frame: 10,
        speed: 1,
        unitWidth: 0,
        direction: "left",
      }),
    ).toBe(0);
  });
});

describe("getRepeatCount", () => {
  it("covers the viewport plus two loop units", () => {
    expect(getRepeatCount(1280, 400)).toBe(6);
  });
});

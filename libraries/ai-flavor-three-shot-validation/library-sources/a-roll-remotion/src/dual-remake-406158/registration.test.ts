import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { describe, expect, it } from "vitest";
import { RemotionRoot } from "../Root";
import { DUAL_REMAKE_406158_PAIRS } from "./catalog";

type CompositionProps = {
  readonly id?: string;
  readonly width?: number;
  readonly height?: number;
  readonly fps?: number;
  readonly durationInFrames?: number;
  readonly defaultProps?: { readonly mode?: string };
};

const root = RemotionRoot() as ReactElement<{ readonly children?: ReactNode }>;
const compositions = Children.toArray(root.props.children)
  .filter(isValidElement<CompositionProps>)
  .filter((element) => typeof element.props.id === "string");

describe("dual remake 406158 composition registration", () => {
  it("registers both modes for every pair with paired render metadata", () => {
    const expected = DUAL_REMAKE_406158_PAIRS.flatMap((pair) => [
      {
        id: `Fast${pair.compositionBaseId}`,
        mode: "fast",
        durationInFrames: pair.durationInFrames,
      },
      {
        id: `Fidelity${pair.compositionBaseId}`,
        mode: "fidelity",
        durationInFrames: pair.durationInFrames,
      },
    ]);

    const actual = compositions
      .filter((composition) =>
        expected.some(({ id }) => id === composition.props.id),
      )
      .map((composition) => ({
        id: composition.props.id,
        mode: composition.props.defaultProps?.mode,
        durationInFrames: composition.props.durationInFrames,
        width: composition.props.width,
        height: composition.props.height,
        fps: composition.props.fps,
      }));

    expect(actual).toEqual(
      expected.map((composition) => ({
        ...composition,
        width: 1920,
        height: 1080,
        fps: 30,
      })),
    );
  });
});

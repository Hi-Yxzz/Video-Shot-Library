import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";
import {ElementCard} from "./ElementCard";

const baseStyle = {
  width: 150,
  height: 82,
  borderRadius: 12,
  shadow: 0.25,
};

describe("ElementCard", () => {
  it("renders text content", () => {
    const html = renderToStaticMarkup(
      <ElementCard
        item={{
          id: "one",
          type: "text",
          label: "OpenAI",
          accentColor: "#10a37f",
        }}
        {...baseStyle}
      />,
    );
    expect(html).toContain("OpenAI");
  });

  it("renders a readable fallback when an image source is missing", () => {
    const html = renderToStaticMarkup(
      <ElementCard
        item={{
          id: "two",
          type: "image",
          label: "Logo",
          accentColor: "#111111",
        }}
        {...baseStyle}
      />,
    );
    expect(html).toContain("Logo");
  });
});

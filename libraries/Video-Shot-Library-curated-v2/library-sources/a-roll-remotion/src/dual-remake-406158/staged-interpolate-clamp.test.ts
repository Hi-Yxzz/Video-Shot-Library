import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const sourceFiles = [
  "StagedTrainingQuestion.tsx",
  "StagedTrainingQuestionFast.tsx",
  "StagedTrainingQuestionFidelity.tsx",
];

const sources = sourceFiles.map((file) => ({
  file,
  source: readFileSync(
    resolve(process.cwd(), "src/dual-remake-406158/shots", file),
    "utf8",
  ),
}));

const extractInterpolateCalls = (contents: string) => {
  const calls: Array<{ line: number; text: string }> = [];
  let cursor = 0;

  while (cursor < contents.length) {
    const start = contents.indexOf("interpolate(", cursor);
    if (start === -1) break;

    let depth = 0;
    let end = start;
    for (; end < contents.length; end++) {
      if (contents[end] === "(") depth++;
      if (contents[end] === ")") {
        depth--;
        if (depth === 0) {
          end++;
          break;
        }
      }
    }

    calls.push({
      line: contents.slice(0, start).split("\n").length,
      text: contents.slice(start, end),
    });
    cursor = end;
  }

  return calls;
};

describe("StagedTrainingQuestion interpolation bounds", () => {
  it("explicitly clamps every interpolate call on both sides", () => {
    const calls = sources.flatMap(({ file, source }) =>
      extractInterpolateCalls(source).map((call) => ({ ...call, file })),
    );
    const missingClampLines = calls
      .filter(
        ({ text }) =>
          !text.includes('extrapolateLeft: "clamp"') ||
          !text.includes('extrapolateRight: "clamp"'),
      )
      .map(({ file, line }) => `${file}:${line}`);

    expect(calls.length).toBeGreaterThanOrEqual(10);
    expect(missingClampLines).toEqual([]);
  });
});

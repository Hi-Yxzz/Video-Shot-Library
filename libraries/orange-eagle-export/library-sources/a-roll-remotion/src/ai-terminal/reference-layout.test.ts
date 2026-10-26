import {describe, expect, test} from "vitest";
import {AI_TERMINAL_LAYOUT} from "./reference-layout";

describe("AI 对话·终端参考几何", () => {
  test("代码分屏保留参考包围盒", () => {
    expect(AI_TERMINAL_LAYOUT.code).toMatchObject({
      terminalX: 77,
      terminalY: 297,
      portraitX: 1286,
      portraitY: 152,
    });
  });

  test("终端和输入框保留参考包围盒", () => {
    expect(AI_TERMINAL_LAYOUT.terminal).toMatchObject({
      x: 220,
      y: 316,
      width: 1480,
      height: 448,
    });
    expect(AI_TERMINAL_LAYOUT.aiInput).toMatchObject({
      x: 284,
      y: 381,
      width: 1353,
      height: 237,
      typeStart: 32,
      modelSelectorChevron: {
        width: 8,
        height: 5,
        marginLeft: 7,
      },
    });
    expect(AI_TERMINAL_LAYOUT.contextTerminal).toMatchObject({
      inputTop: 764,
      inputHeight: 72,
    });
  });

  test("命令菜单保留四阶段时间轴", () => {
    expect(AI_TERMINAL_LAYOUT.commandMenu.stageFrames).toEqual([
      18, 58, 98, 138,
    ]);
  });
});

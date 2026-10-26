type LoopOffsetInput = {
  frame: number;
  speed: number;
  unitWidth: number;
  direction: "left" | "right";
};

export const getLoopOffset = ({
  frame,
  speed,
  unitWidth,
  direction,
}: LoopOffsetInput) => {
  if (speed === 0 || unitWidth <= 0) {
    return 0;
  }

  const progress = (frame * speed) % unitWidth;
  if (direction === "left" && progress === 0) {
    return 0;
  }

  return direction === "left" ? -progress : -unitWidth + progress;
};

export const getRepeatCount = (
  viewportWidth: number,
  unitWidth: number,
) => {
  if (unitWidth <= 0) {
    return 0;
  }

  return Math.ceil(viewportWidth / unitWidth) + 2;
};

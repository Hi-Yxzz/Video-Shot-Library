export const clampedProgress = (
  frame: number,
  start: number,
  end: number,
): number => {
  if (frame <= start) return 0;
  if (frame >= end) return 1;
  return (frame - start) / (end - start);
};

export const visibleCount = (
  frame: number,
  revealFrames: readonly number[],
): number => revealFrames.filter((revealFrame) => frame >= revealFrame).length;

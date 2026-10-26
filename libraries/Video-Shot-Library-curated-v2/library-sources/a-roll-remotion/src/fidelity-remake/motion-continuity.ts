const clamp = (value: number) => Math.max(0, Math.min(1, value));

const smoothstep = (value: number) => {
  const progress = clamp(value);
  return progress * progress * (3 - 2 * progress);
};

export const getLeaderboardFocus = (frame: number) => {
  const progress = smoothstep((frame - 94) / (143 - 94));

  return {
    xPercent: 50 + progress * 5,
    yPercent: 50 + progress * 19,
  };
};

export const getOrbitalBlinkOpacity = (frame: number) => {
  const fadeIn = smoothstep((frame - 13) / 3);
  const fadeOut = 1 - smoothstep((frame - 22) / 4);
  const envelope = fadeIn * fadeOut;
  const pulse = 0.86 + Math.sin(((frame - 16) * Math.PI) / 3) * 0.06;

  return 1 - envelope * (1 - pulse);
};

export const getStarTwinkleOpacity = (frame: number, index: number) =>
  0.32 + Math.sin(((frame + index * 7) * Math.PI * 2) / 30) * 0.1;

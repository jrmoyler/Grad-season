/** Linear interpolation clamped to [0, 1] */
export function clamp01(t: number): number {
  return Math.max(0, Math.min(1, t));
}

/** Ease-out cubic */
export function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/** Ease-in-out cubic */
export function easeInOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Spring-like overshoot easing */
export function spring(t: number): number {
  return 1 + Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI) / 3);
}

/** Map a frame number into a 0→1 progress within a window, with easing */
export function progress(
  frame: number,
  startFrame: number,
  endFrame: number,
  ease: (t: number) => number = easeOut,
): number {
  const raw = clamp01((frame - startFrame) / (endFrame - startFrame));
  return ease(raw);
}

/** Fade-up: returns { opacity, translateY } */
export function fadeUp(
  frame: number,
  startFrame: number,
  durationFrames: number = 25,
  distance: number = 40,
): { opacity: number; translateY: number } {
  const t = progress(frame, startFrame, startFrame + durationFrames, easeOut);
  return { opacity: t, translateY: (1 - t) * distance };
}

/** Shimmer x position for gradient animation */
export function shimmerX(frame: number): string {
  const pos = ((frame * 4) % 800) - 400;
  return `${pos}px`;
}

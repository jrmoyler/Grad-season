import React from 'react';
import { useCurrentFrame } from 'remotion';
import { COLORS, VIDEO_HEIGHT, VIDEO_WIDTH } from '../tokens';

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  offset: number;
  opacity: number;
}

// Pre-seeded deterministic stars (no Math.random at render time)
const STARS: Star[] = [
  { x: 0.08, y: 0.95, size: 2, speed: 0.00045, offset: 0, opacity: 0.7 },
  { x: 0.22, y: 0.85, size: 3, speed: 0.00035, offset: 20, opacity: 0.5 },
  { x: 0.38, y: 0.90, size: 2, speed: 0.00055, offset: 40, opacity: 0.8 },
  { x: 0.55, y: 0.80, size: 2, speed: 0.00040, offset: 60, opacity: 0.6 },
  { x: 0.70, y: 0.88, size: 3, speed: 0.00060, offset: 10, opacity: 0.7 },
  { x: 0.85, y: 0.75, size: 2, speed: 0.00030, offset: 80, opacity: 0.5 },
  { x: 0.14, y: 0.70, size: 2, speed: 0.00050, offset: 50, opacity: 0.6 },
  { x: 0.47, y: 0.60, size: 3, speed: 0.00038, offset: 30, opacity: 0.4 },
  { x: 0.62, y: 0.65, size: 2, speed: 0.00048, offset: 70, opacity: 0.7 },
  { x: 0.91, y: 0.55, size: 2, speed: 0.00042, offset: 15, opacity: 0.6 },
  { x: 0.30, y: 0.45, size: 3, speed: 0.00033, offset: 90, opacity: 0.5 },
  { x: 0.75, y: 0.40, size: 2, speed: 0.00058, offset: 25, opacity: 0.8 },
  { x: 0.05, y: 0.30, size: 2, speed: 0.00044, offset: 55, opacity: 0.6 },
  { x: 0.50, y: 0.25, size: 3, speed: 0.00036, offset: 45, opacity: 0.5 },
  { x: 0.95, y: 0.20, size: 2, speed: 0.00052, offset: 35, opacity: 0.7 },
  { x: 0.18, y: 0.15, size: 2, speed: 0.00028, offset: 65, opacity: 0.4 },
  { x: 0.42, y: 0.10, size: 3, speed: 0.00062, offset: 5,  opacity: 0.6 },
  { x: 0.66, y: 0.05, size: 2, speed: 0.00040, offset: 75, opacity: 0.5 },
  { x: 0.88, y: 0.35, size: 2, speed: 0.00032, offset: 85, opacity: 0.7 },
  { x: 0.33, y: 0.50, size: 3, speed: 0.00056, offset: 95, opacity: 0.6 },
  { x: 0.77, y: 0.72, size: 2, speed: 0.00046, offset: 12, opacity: 0.8 },
  { x: 0.11, y: 0.58, size: 2, speed: 0.00038, offset: 38, opacity: 0.5 },
  { x: 0.56, y: 0.42, size: 3, speed: 0.00054, offset: 22, opacity: 0.6 },
  { x: 0.24, y: 0.78, size: 2, speed: 0.00034, offset: 68, opacity: 0.7 },
  { x: 0.80, y: 0.62, size: 2, speed: 0.00048, offset: 48, opacity: 0.4 },
];

export const StarField: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        opacity,
      }}
    >
      {STARS.map((star, i) => {
        // Each star starts at bottom and floats up, resetting cyclically
        const cycleFrames = Math.round(1 / star.speed);
        const elapsed = (frame + star.offset * 10) % cycleFrames;
        const yFrac = 1 - (elapsed * star.speed);
        const y = yFrac * VIDEO_HEIGHT;
        const x = star.x * VIDEO_WIDTH;
        const rotation = elapsed * star.speed * 360;
        const fadeOut = yFrac < 0.15 ? yFrac / 0.15 : 1;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: star.size,
              height: star.size,
              borderRadius: '50%',
              background: COLORS.gold,
              opacity: star.opacity * fadeOut,
              transform: `rotate(${rotation}deg)`,
            }}
          />
        );
      })}
    </div>
  );
};

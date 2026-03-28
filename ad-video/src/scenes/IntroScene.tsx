import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONTS } from '../tokens';
import { StarField } from '../components/StarField';
import { GradCapIcon, SparkleIcon } from '../components/GradCapIcon';
import { fadeUp, progress, easeOut } from '../utils';

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background fade in
  const bgOpacity = progress(frame, 0, 20, easeOut);

  // Logo scale + fade
  const logoFade = fadeUp(frame, 15, 30, 30);

  // Glow pulse
  const glowScale = 0.9 + 0.1 * Math.sin((frame / fps) * Math.PI * 2 * 0.5);
  const glowOpacity = 0.15 + 0.08 * Math.sin((frame / fps) * Math.PI * 2 * 0.3);

  // Star field opacity
  const starOpacity = progress(frame, 10, 50, easeOut) * 0.6;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: COLORS.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        position: 'relative',
        opacity: bgOpacity,
        overflow: 'hidden',
      }}
    >
      {/* Background radial glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -55%) scale(${glowScale})`,
          width: 900,
          height: 600,
          background: `radial-gradient(ellipse, rgba(240,180,41,${glowOpacity}) 0%, rgba(120,80,200,0.06) 40%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <StarField opacity={starOpacity} />

      {/* Logo lockup */}
      <div
        style={{
          opacity: logoFade.opacity,
          transform: `translateY(${logoFade.translateY}px)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
        }}
      >
        {/* Icon + wordmark */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
          }}
        >
          <div
            style={{
              width: 90,
              height: 90,
              borderRadius: 24,
              background: `radial-gradient(circle at 30% 25%, rgba(255,255,255,.18), rgba(240,180,41,.16) 34%, rgba(21,17,43,.96) 100%)`,
              border: `1px solid rgba(240,180,41,.22)`,
              boxShadow: `inset 0 1px 0 rgba(255,255,255,.16), 0 18px 36px rgba(0,0,0,.34), 0 0 0 1px rgba(240,180,41,.05)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <GradCapIcon size={52} color={COLORS.gold} />
          </div>
          <div
            style={{
              fontFamily: FONTS.serif,
              fontSize: 72,
              fontWeight: 900,
              color: COLORS.gold,
              letterSpacing: -2,
            }}
          >
            Grad Season
          </div>
        </div>

        {/* Tagline badge */}
        <div
          style={{
            opacity: progress(frame, 30, 55, easeOut),
            transform: `translateY(${(1 - progress(frame, 30, 55, easeOut)) * 20}px)`,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            background: 'rgba(240,180,41,0.1)',
            border: '1px solid rgba(240,180,41,0.3)',
            color: COLORS.gold,
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: 2.5,
            padding: '10px 24px',
            borderRadius: 30,
            fontFamily: FONTS.sans,
            textTransform: 'uppercase',
          }}
        >
          <SparkleIcon size={18} />
          2026 Graduation Season
          <SparkleIcon size={18} />
        </div>
      </div>

      {/* Bottom separator line */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 1,
          background: `rgba(240,180,41,${progress(frame, 60, 90, easeOut) * 0.2})`,
        }}
      />
    </div>
  );
};

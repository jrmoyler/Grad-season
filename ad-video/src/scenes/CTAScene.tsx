import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONTS } from '../tokens';
import { StarField } from '../components/StarField';
import { GradCapIcon, SparkleIcon } from '../components/GradCapIcon';
import { fadeUp, progress, easeOut, shimmerX, spring } from '../utils';

export const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const glowScale = 1 + 0.08 * Math.sin((frame / fps) * Math.PI * 2 * 0.4);
  const glowOpacity = 0.12 + 0.06 * Math.sin((frame / fps) * Math.PI * 2 * 0.3);
  const pulseGlow = 0.3 + 0.2 * Math.sin((frame / fps) * Math.PI * 2 * 0.5);

  const badgeFade = fadeUp(frame, 5, 25, 28);
  const title1Fade = fadeUp(frame, 20, 28, 36);
  const title2Fade = fadeUp(frame, 35, 28, 36);
  const subFade = fadeUp(frame, 50, 25, 30);
  const ctaFade = progress(frame, 65, 95, spring);
  const urgencyFade = fadeUp(frame, 100, 25, 24);

  const shimmerPos = shimmerX(frame);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: COLORS.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
        padding: '0 120px',
      }}
    >
      {/* Large radial glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${glowScale})`,
          width: 1200,
          height: 700,
          background: `radial-gradient(ellipse, rgba(240,180,41,${glowOpacity}) 0%, rgba(120,80,200,0.07) 45%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <StarField opacity={0.55} />

      {/* Logo mark at top */}
      <div
        style={{
          opacity: badgeFade.opacity,
          transform: `translateY(${badgeFade.translateY}px)`,
          position: 'relative',
          zIndex: 1,
          marginBottom: 36,
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 22,
            background: `radial-gradient(circle at 30% 25%, rgba(255,255,255,.18), rgba(240,180,41,.16) 34%, rgba(21,17,43,.96) 100%)`,
            border: `1px solid rgba(240,180,41,.22)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            boxShadow: `0 0 ${pulseGlow * 60}px rgba(240,180,41,${pulseGlow * 0.4})`,
          }}
        >
          <GradCapIcon size={46} color={COLORS.gold} />
        </div>
      </div>

      {/* Heading */}
      <div
        style={{
          opacity: title1Fade.opacity,
          transform: `translateY(${title1Fade.translateY}px)`,
          fontFamily: FONTS.serif,
          fontSize: 96,
          fontWeight: 900,
          lineHeight: 1.0,
          letterSpacing: -3,
          color: COLORS.cream,
          position: 'relative',
          zIndex: 1,
        }}
      >
        Make it
      </div>
      <div
        style={{
          opacity: title2Fade.opacity,
          transform: `translateY(${title2Fade.translateY}px)`,
          fontFamily: FONTS.serif,
          fontSize: 96,
          fontWeight: 900,
          fontStyle: 'italic',
          lineHeight: 1.0,
          letterSpacing: -3,
          marginBottom: 32,
          background: `linear-gradient(135deg, ${COLORS.gold} 0%, ${COLORS.goldBright} 40%, ${COLORS.gold} 100%)`,
          backgroundSize: '600px 100%',
          backgroundPosition: shimmerPos,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          position: 'relative',
          zIndex: 1,
        }}
      >
        unforgettable.
      </div>

      {/* Sub-copy */}
      <p
        style={{
          opacity: subFade.opacity,
          transform: `translateY(${subFade.translateY}px)`,
          fontFamily: FONTS.sans,
          fontSize: 26,
          color: COLORS.soft,
          maxWidth: 720,
          lineHeight: 1.7,
          marginBottom: 52,
          position: 'relative',
          zIndex: 1,
        }}
      >
        Pre-orders are open for the 2026 graduation season.{' '}
        <span style={{ color: COLORS.cream, fontWeight: 600 }}>
          Reserve yours today
        </span>{' '}
        and give your graduate the one gift no one else will ever receive.
      </p>

      {/* CTA button */}
      <div
        style={{
          opacity: Math.min(ctaFade, 1),
          transform: `scale(${0.8 + ctaFade * 0.2})`,
          position: 'relative',
          zIndex: 1,
          marginBottom: 36,
        }}
      >
        <div
          style={{
            background: COLORS.gold,
            color: COLORS.bg,
            fontFamily: FONTS.sans,
            fontWeight: 800,
            fontSize: 28,
            padding: '22px 64px',
            borderRadius: 14,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            boxShadow: `0 0 ${pulseGlow * 80}px rgba(240,180,41,${pulseGlow * 0.5}), 0 12px 40px rgba(240,180,41,0.3)`,
          }}
        >
          Reserve Your Keepsake →
        </div>
      </div>

      {/* Urgency */}
      <div
        style={{
          opacity: urgencyFade.opacity,
          transform: `translateY(${urgencyFade.translateY}px)`,
          fontFamily: FONTS.sans,
          fontSize: 17,
          color: COLORS.muted,
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <SparkleIcon size={16} />
        <span>
          Limited pre-order spots ·{' '}
          <span style={{ color: COLORS.gold, fontWeight: 700 }}>
            Delivery by graduation day
          </span>
        </span>
        <SparkleIcon size={16} />
      </div>

      {/* Footer brand */}
      <div
        style={{
          position: 'absolute',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: progress(frame, 120, 150, easeOut) * 0.5,
          fontFamily: FONTS.serif,
          fontSize: 18,
          fontWeight: 900,
          color: COLORS.gold,
          letterSpacing: -0.3,
        }}
      >
        Grad Season
      </div>
    </div>
  );
};

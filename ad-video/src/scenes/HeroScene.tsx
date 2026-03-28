import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONTS } from '../tokens';
import { StarField } from '../components/StarField';
import { FigurineIcon, LightningIcon, BookIcon } from '../components/GradCapIcon';
import { fadeUp, progress, easeOut, shimmerX } from '../utils';

const ProductFloater: React.FC<{
  icon: React.ReactNode;
  name: string;
  price: string;
  delay: number;
  frame: number;
  floatOffset: number;
}> = ({ icon, name, price, delay, frame, floatOffset }) => {
  const enterP = progress(frame, delay, delay + 25, easeOut);
  const floatY = Math.sin(((frame + floatOffset) / 50) * Math.PI) * 10;

  return (
    <div
      style={{
        opacity: enterP,
        transform: `translateY(${(1 - enterP) * 30 + floatY}px)`,
        background: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 20,
        padding: '28px 36px',
        textAlign: 'center',
        minWidth: 180,
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 20,
          background: `radial-gradient(circle at 30% 25%, rgba(255,255,255,.18), rgba(240,180,41,.16) 34%, rgba(21,17,43,.96) 100%)`,
          border: `1px solid rgba(240,180,41,.22)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 14px',
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontFamily: FONTS.sans,
          fontWeight: 700,
          fontSize: 20,
          color: COLORS.text,
          marginBottom: 6,
        }}
      >
        {name}
      </div>
      <div
        style={{
          fontFamily: FONTS.sans,
          fontWeight: 800,
          fontSize: 18,
          color: COLORS.gold,
        }}
      >
        {price}
      </div>
    </div>
  );
};

export const HeroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const glowOpacity = 0.12 + 0.06 * Math.sin((frame / fps) * Math.PI);

  // Shimmer on "Their keepsake."
  const shimmerPos = shimmerX(frame);

  const eyebrowFade = fadeUp(frame, 5, 25, 30);
  const line1Fade = fadeUp(frame, 20, 28, 36);
  const line2Fade = fadeUp(frame, 32, 28, 36);
  const subFade = fadeUp(frame, 50, 25, 32);

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
      }}
    >
      {/* Radial glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -60%)',
          width: 1000,
          height: 700,
          background: `radial-gradient(ellipse, rgba(240,180,41,${glowOpacity}) 0%, rgba(120,80,200,0.07) 40%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <StarField opacity={0.4} />

      {/* Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 0,
          position: 'relative',
          zIndex: 1,
          padding: '0 120px',
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            opacity: eyebrowFade.opacity,
            transform: `translateY(${eyebrowFade.translateY}px)`,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            background: 'rgba(240,180,41,0.1)',
            border: '1px solid rgba(240,180,41,0.3)',
            color: COLORS.gold,
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: 2,
            padding: '9px 20px',
            borderRadius: 24,
            marginBottom: 36,
            fontFamily: FONTS.sans,
            textTransform: 'uppercase',
          }}
        >
          ✦ &nbsp; Custom Graduation Keepsakes &nbsp; ✦
        </div>

        {/* Heading line 1 */}
        <div
          style={{
            opacity: line1Fade.opacity,
            transform: `translateY(${line1Fade.translateY}px)`,
            fontFamily: FONTS.serif,
            fontSize: 120,
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: -4,
            color: COLORS.cream,
          }}
        >
          Their story.
        </div>

        {/* Heading line 2 — shimmer gold */}
        <div
          style={{
            opacity: line2Fade.opacity,
            transform: `translateY(${line2Fade.translateY}px)`,
            fontFamily: FONTS.serif,
            fontSize: 120,
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: -4,
            marginBottom: 40,
            background: `linear-gradient(135deg, ${COLORS.gold} 0%, ${COLORS.goldBright} 40%, ${COLORS.gold} 100%)`,
            backgroundSize: '600px 100%',
            backgroundPosition: shimmerPos,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Their keepsake.
        </div>

        {/* Sub-copy */}
        <p
          style={{
            opacity: subFade.opacity,
            transform: `translateY(${subFade.translateY}px)`,
            fontFamily: FONTS.sans,
            fontSize: 28,
            color: COLORS.soft,
            maxWidth: 800,
            lineHeight: 1.7,
            marginBottom: 64,
          }}
        >
          Custom figurines, comic books, and storybooks{' '}
          <span style={{ color: COLORS.cream, fontWeight: 600 }}>
            built around your graduate's real life
          </span>{' '}
          — their memories, their challenges, their wins.
        </p>

        {/* Product floaters */}
        <div
          style={{
            display: 'flex',
            gap: 28,
            justifyContent: 'center',
          }}
        >
          <ProductFloater
            icon={<FigurineIcon size={40} />}
            name="Figurine"
            price="from $89"
            delay={80}
            frame={frame}
            floatOffset={0}
          />
          <ProductFloater
            icon={<LightningIcon size={40} />}
            name="Comic Book"
            price="from $34"
            delay={95}
            frame={frame}
            floatOffset={18}
          />
          <ProductFloater
            icon={<BookIcon size={40} />}
            name="Storybook"
            price="from $44"
            delay={110}
            frame={frame}
            floatOffset={36}
          />
        </div>
      </div>
    </div>
  );
};

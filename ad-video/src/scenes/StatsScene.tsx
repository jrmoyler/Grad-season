import React from 'react';
import { useCurrentFrame } from 'remotion';
import { COLORS, FONTS } from '../tokens';
import { StarField } from '../components/StarField';
import { progress, easeOut, spring } from '../utils';

interface StatItemProps {
  num: string;
  label: string;
  delay: number;
  frame: number;
}

const StatItem: React.FC<StatItemProps> = ({ num, label, delay, frame }) => {
  const p = progress(frame, delay, delay + 30, spring);

  return (
    <div
      style={{
        textAlign: 'center',
        opacity: Math.min(p, 1),
        transform: `scale(${0.6 + p * 0.4})`,
      }}
    >
      <div
        style={{
          fontFamily: FONTS.serif,
          fontSize: 80,
          fontWeight: 900,
          color: COLORS.gold,
          lineHeight: 1,
          textShadow: `0 0 40px rgba(240,180,41,0.4)`,
        }}
      >
        {num}
      </div>
      <div
        style={{
          fontFamily: FONTS.sans,
          fontSize: 16,
          fontWeight: 600,
          color: COLORS.muted,
          letterSpacing: 1,
          textTransform: 'uppercase',
          marginTop: 10,
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const StatsScene: React.FC = () => {
  const frame = useCurrentFrame();

  const headerP = progress(frame, 0, 25, easeOut);
  const lineP = progress(frame, 15, 40, easeOut);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: COLORS.surface,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        gap: 72,
        borderTop: `1px solid ${COLORS.border}`,
        borderBottom: `1px solid ${COLORS.border}`,
      }}
    >
      {/* Subtle grain/gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 50% 50%, rgba(240,180,41,0.07) 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <StarField opacity={0.2} />

      {/* Header */}
      <div
        style={{
          opacity: headerP,
          transform: `translateY(${(1 - headerP) * 24}px)`,
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.sans,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 3,
            color: COLORS.gold,
            textTransform: 'uppercase',
            marginBottom: 14,
          }}
        >
          By The Numbers
        </div>
        <div
          style={{
            fontFamily: FONTS.serif,
            fontSize: 56,
            fontWeight: 900,
            color: COLORS.cream,
            letterSpacing: -1.5,
          }}
        >
          Personalized in every way.
        </div>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 1100,
          justifyContent: 'center',
        }}
      >
        <StatItem num="100%" label="Personalized" delay={25} frame={frame} />

        {/* Divider */}
        <div
          style={{
            width: 1,
            height: lineP * 120,
            background: COLORS.border,
            margin: '0 80px',
          }}
        />

        <StatItem num="3" label="Styles Per Product" delay={40} frame={frame} />

        <div
          style={{
            width: 1,
            height: lineP * 120,
            background: COLORS.border,
            margin: '0 80px',
          }}
        />

        <StatItem num="Pre-K–12+" label="All Grad Levels" delay={55} frame={frame} />

        <div
          style={{
            width: 1,
            height: lineP * 120,
            background: COLORS.border,
            margin: '0 80px',
          }}
        />

        <StatItem num="No Two" label="Are The Same" delay={70} frame={frame} />
      </div>

      {/* Testimonial quote */}
      <div
        style={{
          opacity: progress(frame, 80, 110, easeOut),
          transform: `translateY(${(1 - progress(frame, 80, 110, easeOut)) * 20}px)`,
          textAlign: 'center',
          maxWidth: 780,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.serif,
            fontSize: 30,
            fontStyle: 'italic',
            color: COLORS.soft,
            lineHeight: 1.6,
            marginBottom: 20,
          }}
        >
          "Nothing generic makes it into the final product — every detail is built from your graduate's real story."
        </div>
        <div
          style={{
            display: 'inline-flex',
            gap: 6,
          }}
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <span key={i} style={{ color: COLORS.gold, fontSize: 22 }}>★</span>
          ))}
        </div>
      </div>
    </div>
  );
};

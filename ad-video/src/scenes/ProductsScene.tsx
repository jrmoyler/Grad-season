import React from 'react';
import { useCurrentFrame } from 'remotion';
import { COLORS, FONTS } from '../tokens';
import { StarField } from '../components/StarField';
import { FigurineIcon, LightningIcon, BookIcon } from '../components/GradCapIcon';
import { progress, easeOut } from '../utils';

interface ProductCardProps {
  icon: React.ReactNode;
  name: string;
  tagline: string;
  price: string;
  styles: string[];
  features: string[];
  delay: number;
  frame: number;
  highlight?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  icon,
  name,
  tagline,
  price,
  styles,
  features,
  delay,
  frame,
  highlight = false,
}) => {
  const enterP = progress(frame, delay, delay + 35, easeOut);
  const glowP = progress(frame, delay + 10, delay + 50, easeOut);

  return (
    <div
      style={{
        opacity: enterP,
        transform: `translateY(${(1 - enterP) * 50}px) scale(${0.95 + enterP * 0.05})`,
        background: COLORS.surface,
        border: `1px solid ${highlight ? 'rgba(240,180,41,0.45)' : COLORS.border}`,
        borderRadius: 20,
        overflow: 'hidden',
        flex: 1,
        boxShadow: highlight
          ? `0 0 ${glowP * 60}px rgba(240,180,41,${glowP * 0.25}), 0 20px 60px rgba(0,0,0,0.5)`
          : '0 20px 60px rgba(0,0,0,0.4)',
        position: 'relative',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '32px 28px 24px',
          borderBottom: `1px solid ${COLORS.border}`,
          position: 'relative',
          background: highlight
            ? 'linear-gradient(135deg, rgba(240,180,41,0.08) 0%, transparent 60%)'
            : 'linear-gradient(135deg, rgba(240,180,41,0.04) 0%, transparent 60%)',
        }}
      >
        {/* Price tag */}
        <div
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            background: 'rgba(240,180,41,0.15)',
            border: '1px solid rgba(240,180,41,0.35)',
            color: COLORS.gold,
            fontWeight: 800,
            fontSize: 22,
            padding: '6px 16px',
            borderRadius: 10,
            fontFamily: FONTS.sans,
          }}
        >
          {price}
        </div>

        {/* Icon */}
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
            marginBottom: 16,
          }}
        >
          {icon}
        </div>

        <div
          style={{
            fontFamily: FONTS.sans,
            fontWeight: 800,
            fontSize: 26,
            color: COLORS.cream,
            marginBottom: 8,
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontFamily: FONTS.sans,
            fontSize: 16,
            color: COLORS.muted,
            lineHeight: 1.5,
          }}
        >
          {tagline}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '20px 28px' }}>
        {/* Style chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
          {styles.map((s) => (
            <span
              key={s}
              style={{
                background: COLORS.surface2,
                border: `1px solid ${COLORS.border}`,
                color: COLORS.soft,
                fontSize: 13,
                fontWeight: 600,
                padding: '5px 12px',
                borderRadius: 24,
                fontFamily: FONTS.sans,
              }}
            >
              {s}
            </span>
          ))}
        </div>

        {/* Features */}
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {features.map((f) => (
            <li
              key={f}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                fontSize: 15,
                color: COLORS.soft,
                padding: '6px 0',
                lineHeight: 1.5,
                fontFamily: FONTS.sans,
                borderBottom: `1px solid rgba(255,255,255,0.04)`,
              }}
            >
              <span style={{ color: COLORS.gold, fontWeight: 800, flexShrink: 0, marginTop: 1 }}>✓</span>
              {f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const ProductsScene: React.FC = () => {
  const frame = useCurrentFrame();

  const headerFade = progress(frame, 0, 25, easeOut);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: COLORS.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '64px 80px',
      }}
    >
      <StarField opacity={0.25} />

      {/* Section header */}
      <div
        style={{
          opacity: headerFade,
          transform: `translateY(${(1 - headerFade) * 24}px)`,
          textAlign: 'center',
          marginBottom: 52,
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
          What We Make
        </div>
        <div
          style={{
            fontFamily: FONTS.serif,
            fontSize: 64,
            fontWeight: 900,
            color: COLORS.cream,
            letterSpacing: -2,
            lineHeight: 1.05,
          }}
        >
          Three products. One story. Theirs.
        </div>
      </div>

      {/* Cards grid */}
      <div
        style={{
          display: 'flex',
          gap: 24,
          width: '100%',
          position: 'relative',
          zIndex: 1,
          flex: 1,
          alignItems: 'stretch',
        }}
      >
        <ProductCard
          icon={<FigurineIcon size={44} />}
          name="Custom Figurine"
          tagline="A 3D printed sculpture of your graduate — in the style and outfit you choose."
          price="$89"
          styles={['Claymation', 'Funko Pop', 'Realistic']}
          features={[
            'Choose graduation fit, uploaded photo, or future career',
            'Generated in Tripo3d.ai from real details',
            '3D printed and shipped to your door',
            'Keepsake-quality — made to last',
          ]}
          delay={20}
          frame={frame}
        />
        <ProductCard
          icon={<LightningIcon size={44} />}
          name="Custom Comic"
          tagline="Your graduate is the hero. Their real story is the plot. 12 pages, fully illustrated."
          price="$34"
          styles={['Manga / Anime', 'Superhero', 'Cartoon Strip']}
          features={[
            'Built from their real memories and challenges',
            "Superhero style? They get their own powers",
            'Manga style? Speed lines, big emotion, all of it',
            'Professionally printed and bound',
          ]}
          delay={45}
          frame={frame}
          highlight
        />
        <ProductCard
          icon={<BookIcon size={44} />}
          name="Custom Storybook"
          tagline="A 10–12 page illustrated storybook that tells their journey — written for them alone."
          price="$44"
          styles={['Watercolor', 'Graphic Novel', "Classic Children's"]}
          features={[
            'Written at the right reading level for their grade',
            'Your dedication message printed inside',
            'Every page references something real from their life',
            'Printed through our partner press',
          ]}
          delay={70}
          frame={frame}
        />
      </div>
    </div>
  );
};

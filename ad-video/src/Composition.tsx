import React from 'react';
import {
  AbsoluteFill,
  Series,
  useVideoConfig,
} from 'remotion';
import { IntroScene } from './scenes/IntroScene';
import { HeroScene } from './scenes/HeroScene';
import { ProductsScene } from './scenes/ProductsScene';
import { StatsScene } from './scenes/StatsScene';
import { CTAScene } from './scenes/CTAScene';
import { SCENES } from './tokens';

/**
 * Main ad composition — 35 seconds @ 30 fps.
 *
 * Scene order:
 *  1. Intro     (0  – 3.3s)  Brand reveal
 *  2. Hero      (3.3 – 11s)  "Their story. Their keepsake." + product floaters
 *  3. Products  (11 – 21s)   3-column card showcase
 *  4. Stats     (21 – 27s)   Social proof numbers
 *  5. CTA       (27 – 35s)   Reserve CTA + urgency
 */
export const GradSeasonAd: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#0C0A14' }}>
      <Series>
        <Series.Sequence durationInFrames={SCENES.intro.duration}>
          <IntroScene />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENES.hero.duration}>
          <HeroScene />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENES.products.duration}>
          <ProductsScene />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENES.stats.duration}>
          <StatsScene />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENES.cta.duration}>
          <CTAScene />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

import React from 'react';
import { Composition } from 'remotion';
import { GradSeasonAd } from './Composition';
import { VIDEO_WIDTH, VIDEO_HEIGHT, FPS, TOTAL_FRAMES } from './tokens';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="GradSeasonAd"
        component={GradSeasonAd}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
    </>
  );
};

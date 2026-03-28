export const COLORS = {
  bg: '#0C0A14',
  surface: '#15112B',
  surface2: '#1E1940',
  border: '#2E2855',
  gold: '#F0B429',
  goldDim: '#C8952A',
  goldBright: '#FFDD77',
  cream: '#FDF6E3',
  text: '#EDE8FF',
  muted: '#8B82B0',
  soft: '#C4BADD',
  green: '#52D88A',
};

export const FONTS = {
  serif: "'Playfair Display', Georgia, serif",
  sans: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
};

// Video dimensions — 1080p landscape
export const VIDEO_WIDTH = 1920;
export const VIDEO_HEIGHT = 1080;
export const FPS = 30;

// Scene durations in frames (30 fps)
export const SCENES = {
  intro:    { start: 0,   duration: 100 },  // 0–3.3s
  hero:     { start: 100, duration: 230 },  // 3.3–11s
  products: { start: 330, duration: 300 },  // 11–21s
  stats:    { start: 630, duration: 180 },  // 21–27s
  cta:      { start: 810, duration: 240 },  // 27–35s
};

export const TOTAL_FRAMES = 1050; // 35s

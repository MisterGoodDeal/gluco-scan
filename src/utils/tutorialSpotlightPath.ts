export type TutorialSpotlightRingVariant = 'default' | 'accent';

export type TutorialSpotlightHole = {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
  padding?: number;
  showRing?: boolean;
  ringVariant?: TutorialSpotlightRingVariant;
};

const roundedRectPath = (x: number, y: number, w: number, h: number, r: number): string => {
  const radius = Math.min(r, w / 2, h / 2);
  if (radius <= 0) {
    return `M${x},${y} H${x + w} V${y + h} H${x} Z`;
  }

  return [
    `M${x + radius},${y}`,
    `H${x + w - radius}`,
    `A${radius},${radius} 0 0 1 ${x + w},${y + radius}`,
    `V${y + h - radius}`,
    `A${radius},${radius} 0 0 1 ${x + w - radius},${y + h}`,
    `H${x + radius}`,
    `A${radius},${radius} 0 0 1 ${x},${y + h - radius}`,
    `V${y + radius}`,
    `A${radius},${radius} 0 0 1 ${x + radius},${y}`,
    'Z',
  ].join(' ');
};

export const buildTutorialSpotlightDimPath = (
  screenWidth: number,
  screenHeight: number,
  holes: TutorialSpotlightHole[],
): string => {
  let path = `M0,0 H${screenWidth} V${screenHeight} H0 Z`;

  for (const hole of holes) {
    const pad = hole.padding ?? 6;
    path += roundedRectPath(
      hole.x - pad,
      hole.y - pad,
      hole.width + pad * 2,
      hole.height + pad * 2,
      hole.radius + pad * 0.35,
    );
  }

  return path;
};

export const toSpotlightHole = (
  rect: { x: number; y: number; width: number; height: number },
  radius: number,
  padding?: number,
  showRing = true,
  ringVariant: TutorialSpotlightRingVariant = 'default',
): TutorialSpotlightHole => ({
  x: rect.x,
  y: rect.y,
  width: rect.width,
  height: rect.height,
  radius,
  padding,
  showRing,
  ringVariant,
});

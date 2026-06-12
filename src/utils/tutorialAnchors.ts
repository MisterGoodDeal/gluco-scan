import { type LayoutRectangle, type View } from 'react-native';

import {
  toSpotlightHole,
  type TutorialSpotlightHole,
  type TutorialSpotlightRingVariant,
} from '@/utils/tutorialSpotlightPath';

export type TutorialSpotlightTarget = {
  anchorId: string;
  cornerRadius: number;
  padding?: number;
  showRing?: boolean;
  ringVariant?: TutorialSpotlightRingVariant;
};

const anchors = new Map<string, View>();

export const registerTutorialAnchor = (id: string, ref: View | null): void => {
  if (ref) {
    anchors.set(id, ref);
  } else {
    anchors.delete(id);
  }
};

export const measureTutorialAnchor = (id: string): Promise<LayoutRectangle | null> =>
  new Promise((resolve) => {
    const view = anchors.get(id);
    if (!view) {
      resolve(null);
      return;
    }
    view.measureInWindow((x, y, width, height) => {
      if (width === 0 && height === 0) {
        resolve(null);
        return;
      }
      resolve({ x, y, width, height });
    });
  });

export const measureTutorialAnchorsUnion = async (
  ids: string[],
): Promise<LayoutRectangle | null> => {
  const rects: LayoutRectangle[] = [];
  for (const id of ids) {
    const rect = await measureTutorialAnchor(id);
    if (rect) rects.push(rect);
  }
  if (rects.length === 0) return null;

  const minX = Math.min(...rects.map((r) => r.x));
  const minY = Math.min(...rects.map((r) => r.y));
  const maxX = Math.max(...rects.map((r) => r.x + r.width));
  const maxY = Math.max(...rects.map((r) => r.y + r.height));

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
};

export const measureTutorialAnchorsWithRetry = async (
  ids: string[],
  attempts = 4,
): Promise<LayoutRectangle | null> => {
  if (ids.length === 0) return null;

  for (let attempt = 0; attempt < attempts; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, 150 * (attempt + 1)));
    const rect = await measureTutorialAnchorsUnion(ids);
    if (rect) return rect;
  }
  return null;
};

const measureTutorialAnchorsInOrder = async (
  ids: string[],
): Promise<(LayoutRectangle | null)[]> =>
  Promise.all(ids.map((id) => measureTutorialAnchor(id)));

export const measureTutorialAnchorsListWithRetry = async (
  ids: string[],
  attempts = 6,
): Promise<(LayoutRectangle | null)[]> => {
  if (ids.length === 0) return [];

  for (let attempt = 0; attempt < attempts; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, 120 * (attempt + 1)));
    const rects = await measureTutorialAnchorsInOrder(ids);
    if (rects.every((rect) => rect != null)) return rects;
  }

  return measureTutorialAnchorsInOrder(ids);
};

export const measureTutorialSpotlightTargets = async (
  targets: TutorialSpotlightTarget[],
  attempts = 8,
  initialDelayMs = 0,
  onProgress?: (holes: TutorialSpotlightHole[]) => void,
): Promise<TutorialSpotlightHole[]> => {
  if (targets.length === 0) return [];

  if (initialDelayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, initialDelayMs));
  }

  let bestHoles: TutorialSpotlightHole[] = [];

  for (let attempt = 0; attempt < attempts; attempt++) {
    if (attempt > 0) {
      await new Promise((resolve) => setTimeout(resolve, 140 * (attempt + 1)));
    }

    const holes: TutorialSpotlightHole[] = [];
    for (const target of targets) {
      const rect = await measureTutorialAnchor(target.anchorId);
      if (rect == null) continue;
      holes.push(
        toSpotlightHole(
          rect,
          target.cornerRadius,
          target.padding,
          target.showRing !== false,
          target.ringVariant ?? 'default',
        ),
      );
    }

    if (holes.length > bestHoles.length) {
      bestHoles = holes;
      onProgress?.(bestHoles);
    }
    if (holes.length === targets.length) {
      return holes;
    }
  }

  return bestHoles;
};

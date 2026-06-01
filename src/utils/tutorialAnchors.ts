import { type LayoutRectangle, type View } from 'react-native';

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

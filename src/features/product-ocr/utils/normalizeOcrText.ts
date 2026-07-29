/** Normalize OCR noise for nutrition-label matching (accents kept for display; matching uses folded form). */
export const foldOcrText = (text: string): string =>
  text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase();

export const stripLeaderDots = (line: string): string =>
  line
    .replace(/[.\u00b7\u2022\u2024\u2219\u30fb…]{2,}/g, ' ')
    .replace(/_{2,}|-{2,}/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const normalizeOcrLine = (line: string): string => {
  let s = line
    .replace(/[\u00a0\u202f\u2007]/g, ' ')
    .replace(/[‚‚]/g, ',') // fancy commas → regular
    .replace(/[)\]}>]+$/g, '') // OCR trailing junk: "11,7g)"
    .replace(/^[(\[{<]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  s = stripLeaderDots(s);

  // Digit lookalikes in numeric contexts
  s = s.replace(/(?<=\d)[Oo](?=\d)/g, '0');
  s = s.replace(/(?<=\d)[lI|](?=\d)/g, '1');
  s = s.replace(/(?<=\d),(?=\d)/g, '.');

  // OCR often reads trailing "g" as "9": "5,9 9" / "19,5 9"
  s = s.replace(/(\d+(?:[.,]\d+)?)\s+9\b/g, '$1 g');

  return s;
};

export const normalizeOcrText = (text: string): string =>
  text
    .split(/\r?\n/)
    .map(normalizeOcrLine)
    .filter((line) => line.length > 0)
    .join('\n');

export const parseOcrNumber = (raw: string): number | null => {
  const cleaned = raw
    .replace(/[\u00a0\u202f]/g, '')
    .replace(/(?<=\d)[Oo](?=\d)/g, '0')
    .replace(/(?<=\d)[lI|](?=\d)/g, '1')
    .replace(',', '.')
    .replace(/[^\d.]/g, '');

  if (!cleaned) return null;
  const value = Number.parseFloat(cleaned);
  if (!Number.isFinite(value)) return null;
  return value;
};

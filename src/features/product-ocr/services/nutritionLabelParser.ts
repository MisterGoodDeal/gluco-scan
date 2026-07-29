import type { NutritionLabelBasis, ParsedNutritionLabel } from '@/features/product-ocr/types/ocrDraft';
import {
  foldOcrText,
  normalizeOcrText,
  parseOcrNumber,
  stripLeaderDots,
} from '@/features/product-ocr/utils/normalizeOcrText';

const SUGAR_RE = /\b(dont\s+sucres?|of which sugars?|sugars?|sucres?)\b/i;
/** Match glucides even with light OCR noise (clucides, glucidcs…). */
const CARB_LABEL_RE =
  /\b(g[li1]u?c[li1]des?|carbohydrates?|total\s+carbs?|carbs?(?!\w))\b/i;
const PER_100G_RE =
  /(?:pour|per|\/|\b)\s*100\s*(?:g|gr|grammes?|grams?)\b/i;
const RAW_SECTION_RE = /\b(cru|seche?s?|dry|raw|non\s+cuit)\b/i;
const COOKED_SECTION_RE = /\b(cuit|cooked|prepare)\b/i;
const VALUE_RE = /(\d+(?:[.,]\d+)?)\s*(?:g|gr|grammes?|grams?)?\b/i;
const ENERGY_RE = /\b(energie|energy|kj|kcal)\b/i;

const NUTRITION_HEADER_RE =
  /\b(valeurs?\s+nutritionnelles?|nutrition(?:al)?\s+(?:facts|information|info)|informations?\s+nutritionnelles?)\b/i;

const NUTRITION_NOISE_RE =
  /\b(dont|acides?|gras|fibres?|matieres?|energie|energy|proteines?|protein|phosphore|sel|salt|traces|aqr|conservation|kj|kcal|satur|contient|portions?|consommer|degustation|endroit|soit|reference|apports?)\b/i;

/** Mass-row labels in typical FR table order (excludes energy kJ/kcal). */
const MASS_LABEL_RE =
  /\b(matieres?\s+grasses?|fat|dont\s+acides?|satur|g[li1]u?c[li1]des?|carbohydrates?|dont\s+sucres?|of which sugars?|sucres?|sugars?|fibres?|fiber|proteines?|protein|sel|salt|phosphore|phosphorus)\b/i;

const isAbsurdPer100g = (value: number): boolean => value < 0 || value > 100;

const lineLooksLikeSugars = (line: string): boolean => {
  const folded = foldOcrText(line);
  if (
    SUGAR_RE.test(folded) &&
    !/\bglucides?\b/.test(folded) &&
    !/\bcarbohydrates?\b/.test(folded) &&
    !CARB_LABEL_RE.test(folded)
  ) {
    return true;
  }
  if (/^\s*(dont|of which)\b/i.test(line.trim())) return true;
  return false;
};

const lineHasCarbLabel = (line: string): boolean =>
  CARB_LABEL_RE.test(foldOcrText(line)) && !lineLooksLikeSugars(line);

const lineHasMassLabel = (line: string): boolean => MASS_LABEL_RE.test(foldOcrText(line));

const extractNumberFromText = (text: string): number | null => {
  const folded = foldOcrText(stripLeaderDots(text));
  const afterLabel = folded.match(
    /\b(?:g[li1]u?c[li1]des?|carbohydrates?|total\s+carbs?|carbs?)\b[^0-9]{0,40}(\d+(?:[.,]\d+)?)/i,
  );
  if (afterLabel?.[1]) return parseOcrNumber(afterLabel[1]);

  const trailing = folded.match(/(\d+(?:[.,]\d+)?)\s*(?:g|gr|grammes?|grams?)?\s*$/i);
  if (trailing?.[1]) return parseOcrNumber(trailing[1]);

  const any = text.match(VALUE_RE);
  return any?.[1] ? parseOcrNumber(any[1]) : null;
};

/** Standalone mass cell from two-column OCR (e.g. "48 g", "...1,9 g", ".1,49"). */
const extractOrphanMass = (line: string): number | null => {
  const cleaned = stripLeaderDots(line)
    .replace(/[)\]}>]+$/g, '')
    .replace(/^[(\[{<]+/g, '')
    .trim();
  const folded = foldOcrText(cleaned);
  if (ENERGY_RE.test(folded) && /\b(kj|kcal)\b/.test(folded)) return null;
  if (/\bmg\b/.test(folded)) return null;
  if (lineHasMassLabel(cleaned) || lineHasCarbLabel(cleaned)) return null;
  if (PER_100G_RE.test(folded) || NUTRITION_HEADER_RE.test(folded)) return null;
  if (/\b(traces?|aqr|soit)\b/.test(folded)) return null;

  const withUnit = folded.match(
    /^[\s.]*(\d+(?:[.,]\d+)?)\s*(?:g|gr|grammes?|grams?)\s*$/i,
  );
  if (withUnit?.[1]) {
    const value = parseOcrNumber(withUnit[1]);
    return value != null && !isAbsurdPer100g(value) ? value : null;
  }

  const bare = folded.match(/^[\s.]*(\d+(?:[.,]\d+)?)\s*$/);
  if (bare?.[1]) {
    const value = parseOcrNumber(bare[1]);
    if (value == null || value > 100) return null;
    return value;
  }

  return null;
};

/** Carb value on same line, or on the next 1–2 lines (dotted French labels). */
const extractCarbValueAt = (
  lines: string[],
  index: number,
): { value: number; line: string } | null => {
  const line = lines[index]!;
  if (!lineHasCarbLabel(line)) return null;

  const sameLine = extractNumberFromText(line);
  if (sameLine != null && !isAbsurdPer100g(sameLine)) {
    return { value: sameLine, line };
  }

  for (let offset = 1; offset <= 2; offset += 1) {
    const next = lines[index + offset];
    if (!next) break;
    if (lineHasCarbLabel(next) || lineLooksLikeSugars(next) || lineHasMassLabel(next)) break;
    if (NUTRITION_HEADER_RE.test(foldOcrText(next)) || PER_100G_RE.test(foldOcrText(next))) {
      break;
    }
    const combined = `${line} ${next}`;
    const value =
      extractNumberFromText(combined) ??
      extractOrphanMass(next) ??
      extractNumberFromText(next);
    if (value != null && !isAbsurdPer100g(value)) {
      return { value, line: combined };
    }
  }

  return null;
};

const resolveBasis = (text: string): NutritionLabelBasis => {
  const folded = foldOcrText(text);
  if (RAW_SECTION_RE.test(folded)) return 'raw';
  if (COOKED_SECTION_RE.test(folded)) return 'cooked';
  return 'unknown';
};

const findNearestSectionHeader = (lines: string[], index: number): string | null => {
  for (let i = index; i >= Math.max(0, index - 12); i -= 1) {
    const folded = foldOcrText(lines[i]!);
    if (PER_100G_RE.test(folded) || NUTRITION_HEADER_RE.test(folded)) {
      return lines[i]!;
    }
  }
  return null;
};

const hasPer100gNearby = (lines: string[], index: number): boolean => {
  const windowStart = Math.max(0, index - 4);
  const windowEnd = Math.min(lines.length - 1, index + 1);
  for (let i = windowStart; i <= windowEnd; i += 1) {
    if (PER_100G_RE.test(foldOcrText(lines[i]!))) return true;
  }
  return false;
};

/**
 * Two-column OCR often emits labels then values (or values then labels) as separate lines.
 * Zip unpaired mass-labels with orphan mass values in document order within a section.
 */
const extractCarbsByColumnAlignment = (
  lines: string[],
): Array<{ value: number; line: string; sectionHeader: string | null; basis: NutritionLabelBasis }> => {
  type Section = { header: string | null; start: number; end: number };
  const sections: Section[] = [];
  let current: Section = { header: null, start: 0, end: lines.length };

  for (let i = 0; i < lines.length; i += 1) {
    const folded = foldOcrText(lines[i]!);
    if (PER_100G_RE.test(folded)) {
      current.end = i;
      if (current.end > current.start) sections.push(current);
      current = { header: lines[i]!, start: i + 1, end: lines.length };
    }
  }
  sections.push(current);

  if (sections.length === 0) {
    sections.push({ header: null, start: 0, end: lines.length });
  }

  const results: Array<{
    value: number;
    line: string;
    sectionHeader: string | null;
    basis: NutritionLabelBasis;
  }> = [];

  for (let s = 0; s < sections.length; s += 1) {
    const section = sections[s]!;
    const pendingLabels: string[] = [];
    const orphanValues: number[] = [];

    for (let i = section.start; i < section.end; i += 1) {
      const line = lines[i]!;
      const folded = foldOcrText(line);

      // Skip energy rows (kJ/kcal) — not mass nutrients
      if (ENERGY_RE.test(folded) && /\b(kj|kcal)\b/.test(folded)) continue;
      if (ENERGY_RE.test(folded) && !lineHasMassLabel(line) && extractOrphanMass(line) == null) {
        continue;
      }

      const inlineValue =
        lineHasMassLabel(line) || lineHasCarbLabel(line) ? extractNumberFromText(line) : null;
      if ((lineHasMassLabel(line) || lineHasCarbLabel(line)) && inlineValue == null) {
        pendingLabels.push(line);
        continue;
      }

      const orphan = extractOrphanMass(line);
      if (orphan != null) {
        orphanValues.push(orphan);
      }
    }

    if (pendingLabels.length === 0 || orphanValues.length === 0) continue;

    let basis = resolveBasis(section.header ?? '');
    // Unlabeled block above "Pour 100 g … cuit" is almost always the dry/raw table
    if (basis === 'unknown') {
      const nextHeader = sections[s + 1]?.header ?? null;
      if (nextHeader && resolveBasis(nextHeader) === 'cooked') {
        basis = 'raw';
      }
    }

    const pairCount = Math.min(pendingLabels.length, orphanValues.length);
    for (let i = 0; i < pairCount; i += 1) {
      const label = pendingLabels[i]!;
      if (!lineHasCarbLabel(label) || lineLooksLikeSugars(label)) continue;
      const value = orphanValues[i]!;
      if (isAbsurdPer100g(value)) continue;
      results.push({
        value,
        line: `${label} → ${value} g (column-align)`,
        sectionHeader: section.header,
        basis,
      });
    }
  }

  return results;
};

const guessProductName = (lines: string[]): string | null => {
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length < 3 || trimmed.length > 60) continue;
    const folded = foldOcrText(trimmed);
    if (NUTRITION_HEADER_RE.test(folded)) continue;
    if (PER_100G_RE.test(folded)) continue;
    if (CARB_LABEL_RE.test(folded)) continue;
    if (SUGAR_RE.test(folded)) continue;
    if (NUTRITION_NOISE_RE.test(folded)) continue;
    if (/^\d/.test(trimmed)) continue;
    if (/^[.\s]*\d/.test(trimmed)) continue;
    if (/%/.test(trimmed)) continue;
    if (/[.*•·]{2,}/.test(trimmed)) continue;
    if (/^[\s.*•·*_]+$/.test(trimmed)) continue;
    if (/[a-z][A-Z]{2,}/.test(trimmed) || /[A-Z]{2,}[a-z]+[A-Z]/.test(trimmed)) continue;
    if (/,.*,.*,/.test(trimmed)) continue;
    return trimmed;
  }
  return null;
};

export function parseNutritionLabel(
  ocrText: string,
  _locale: 'fr' | 'en' = 'fr',
): ParsedNutritionLabel {
  const rawText = ocrText;
  const normalized = normalizeOcrText(ocrText);
  const lines = normalized.length > 0 ? normalized.split('\n') : [];

  type Candidate = {
    value: number;
    line: string;
    score: number;
    sectionHeader: string | null;
    basis: ParsedNutritionLabel['basis'];
  };

  const candidates: Candidate[] = [];
  const docHasPer100g = lines.some((line) => PER_100G_RE.test(foldOcrText(line)));

  for (let i = 0; i < lines.length; i += 1) {
    const extracted = extractCarbValueAt(lines, i);
    if (!extracted) continue;

    const { value, line } = extracted;
    let score = 1;
    const folded = foldOcrText(line);
    const section = findNearestSectionHeader(lines, i);
    const sectionFolded = section ? foldOcrText(section) : '';
    const basis = resolveBasis(`${sectionFolded} ${folded}`);

    if (PER_100G_RE.test(folded)) score += 4;
    else if (hasPer100gNearby(lines, i)) score += 3;
    else if (docHasPer100g) score += 2;
    else score -= 3;

    if (/\bglucides?\b/.test(folded) || /\bcarbohydrates?\b/.test(folded)) score += 2;
    else if (CARB_LABEL_RE.test(folded)) score += 1;

    if (basis === 'raw') score += 3;
    if (basis === 'cooked') score += 1;

    if (
      !PER_100G_RE.test(folded) &&
      !hasPer100gNearby(lines, i) &&
      !docHasPer100g &&
      /\b(portion|serving|par\s+portion)\b/i.test(
        foldOcrText(lines.slice(Math.max(0, i - 3), i + 1).join(' ')),
      )
    ) {
      continue;
    }

    candidates.push({ value, line, score, sectionHeader: section, basis });
  }

  // Column-aligned recovery for two-column package layouts
  const alignedHits = extractCarbsByColumnAlignment(lines);
  const hasCookedAlign = alignedHits.some((hit) => hit.basis === 'cooked');
  for (const aligned of alignedHits) {
    let score = 5;
    if (aligned.basis === 'raw') {
      score += 5;
      // Dry/raw table is the GlucoScan storage basis when both tables exist
      if (hasCookedAlign) score += 4;
    }
    if (aligned.basis === 'cooked') score += 2;
    if (aligned.sectionHeader) score += 3;
    else score -= 1;
    candidates.push({
      value: aligned.value,
      line: aligned.line,
      score,
      sectionHeader: aligned.sectionHeader,
      basis: aligned.basis,
    });
  }

  candidates.sort((a, b) => b.score - a.score);
  const best = candidates[0];

  if (!best || best.score < 3) {
    return {
      carbsPer100g: null,
      name: guessProductName(lines),
      confidence: 'low',
      basis: 'unknown',
      rawText,
    };
  }

  const confidence: ParsedNutritionLabel['confidence'] =
    best.score >= 7 ? 'high' : best.score >= 4 ? 'medium' : 'low';

  return {
    carbsPer100g: best.value,
    name: guessProductName(lines),
    confidence,
    matchedLine: best.line,
    sectionHeader: best.sectionHeader ?? undefined,
    basis: best.basis,
    rawText,
  };
}

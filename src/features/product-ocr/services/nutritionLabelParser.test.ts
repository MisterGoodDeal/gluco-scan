import { describe, expect, it } from 'vitest';

import { parseNutritionLabel } from '@/features/product-ocr/services/nutritionLabelParser';

describe('parseNutritionLabel', () => {
  it('parses a typical French label with pour 100 g', () => {
    const text = `
Yaourt nature
Valeurs nutritionnelles
pour 100 g
Energie 250 kJ / 60 kcal
Matières grasses 3,2 g
Glucides 4,5 g
dont sucres 4,5 g
Protéines 3,8 g
`;
    const result = parseNutritionLabel(text, 'fr');
    expect(result.carbsPer100g).toBe(4.5);
    expect(result.confidence).not.toBe('low');
    expect(result.matchedLine?.toLowerCase()).toContain('glucides');
    expect(result.name?.toLowerCase()).toContain('yaourt');
  });

  it('parses English carbohydrates per 100g', () => {
    const text = `
Whole wheat pasta
Nutrition facts per 100 g
Energy 350 kcal
Fat 1.5g
Carbohydrates 72.5g
of which sugars 3.2g
Protein 12g
`;
    const result = parseNutritionLabel(text, 'en');
    expect(result.carbsPer100g).toBe(72.5);
    expect(result.matchedLine?.toLowerCase()).toContain('carbohydrate');
  });

  it('does not take sugars alone as carbs', () => {
    const text = `
Biscuit
pour 100 g
dont sucres 28 g
Sucres 28 g
`;
    const result = parseNutritionLabel(text, 'fr');
    expect(result.carbsPer100g).toBeNull();
    expect(result.confidence).toBe('low');
  });

  it('prefers glucides over dont sucres on adjacent lines', () => {
    const text = `
pour 100g
Glucides 54,0 g
dont sucres 22,0 g
`;
    const result = parseNutritionLabel(text, 'fr');
    expect(result.carbsPer100g).toBe(54);
  });

  it('handles OCR noise (comma, O as zero)', () => {
    const text = `
Informations nutritionnelles / 1O0 g
Glucides 12,5 g
`;
    const result = parseNutritionLabel(text, 'fr');
    expect(result.carbsPer100g).toBe(12.5);
  });

  it('returns null for portion-only values without 100 g context', () => {
    const text = `
Par portion (30 g)
Glucides 8 g
Energie 120 kcal
`;
    const result = parseNutritionLabel(text, 'fr');
    expect(result.carbsPer100g).toBeNull();
    expect(result.confidence).toBe('low');
  });

  it('rejects absurd values above 100 g / 100 g', () => {
    const text = `
pour 100 g
Glucides 145 g
`;
    const result = parseNutritionLabel(text, 'fr');
    expect(result.carbsPer100g).toBeNull();
  });

  it('parses inline glucides for 100 g on same line', () => {
    const text = `Pâtes cuites — Glucides 25 g / 100 g`;
    const result = parseNutritionLabel(text, 'fr');
    expect(result.carbsPer100g).toBe(25);
    expect(result.confidence).toBe('high');
  });

  it('parses carb abbreviation with per 100g header', () => {
    const text = `
Soft drink
Nutritional information
per 100g
Energy 180 kJ
Carb 10.5 g
`;
    const result = parseNutritionLabel(text, 'en');
    expect(result.carbsPer100g).toBe(10.5);
  });

  it('keeps rawText and allows empty name when only table present', () => {
    const text = `
Valeurs nutritionnelles moyennes pour 100 g
Glucides 0,5 g
`;
    const result = parseNutritionLabel(text, 'fr');
    expect(result.carbsPer100g).toBe(0.5);
    expect(result.rawText).toContain('Glucides');
  });

  it('reads glucides when value is on the next line (dotted label OCR)', () => {
    const text = `
Pour 100 g de produit cuit :
Énergie 545 kJ / 129 kcal
Matières grasses ........................ 0,7 g
dont acides gras saturés ................ 0,2 g
Glucides ................................
11,7 g
dont sucres ............................. 1 g
`;
    const result = parseNutritionLabel(text, 'fr');
    expect(result.carbsPer100g).toBe(11.7);
    expect(result.basis).toBe('cooked');
    expect(result.name).toBeNull();
  });

  it('prefers raw/cru glucides over cooked when both tables exist', () => {
    const text = `
Énergie 1146 kJ / 271 kcal
Glucides ........................ 39 g
dont sucres ..................... 1,1 g
Pour 100 g de produit cru
Énergie 1432 kJ / 339 kcal
Glucides ........................ 48 g
dont sucres ..................... 1,4 g
`;
    const result = parseNutritionLabel(text, 'fr');
    expect(result.carbsPer100g).toBe(48);
    expect(result.basis).toBe('raw');
  });

  it('parses cooked 100g table when it is the only 100g section', () => {
    const text = `
Glucides 53 g
dont sucres 2,2 g
Pour 100 g de produit cuit :
Énergie 545 kJ / 129 kcal
Matières grasses 0,7 g
Glucides 11,7 g
dont sucres 1 g
`;
    const result = parseNutritionLabel(text, 'fr');
    expect(result.carbsPer100g).toBe(11.7);
    expect(result.basis).toBe('cooked');
  });

  it('strips leader dots on same line', () => {
    const text = `
Pour 100 g
Glucides ........................ 12,5 g
`;
    const result = parseNutritionLabel(text, 'fr');
    expect(result.carbsPer100g).toBe(12.5);
  });

  it('ignores OCR garbage as product name', () => {
    const text = `
dont aCIdes yids salul ts
Pour 100 g de produit cuit :
Glucides 11,7 g
`;
    const result = parseNutritionLabel(text, 'fr');
    expect(result.carbsPer100g).toBe(11.7);
    expect(result.basis).toBe('cooked');
    expect(result.name).toBeNull();
  });

  it('recovers glucides when OCR splits two columns (labels then values)', () => {
    const text = `
Energie .....1146 kJ / 271 kcal
Matières grasses...
dont acides gras saturés ....
1,5 g
0,3 g
39 g
1,1 g
9,7 g
21 g
0,10 g
Glucides..
dont sucres...
Fibres alimentaires...
Protéines...
Sel...
Pour 100 g de produit cru
Energie...
1432 kJ / 339 kcal
Matieres grasses...
dont acides gras saturés ..
Glucides...
dont sucres...
Fibres alimentaires ...
Protéines ......
Sel..
1,9 g
0,3 g
48 g
1,4 g
12 g
26 g
0,13 g
`;
    const result = parseNutritionLabel(text, 'fr');
    expect(result.carbsPer100g).toBe(48);
    expect(result.basis).toBe('raw');
  });

  it('recovers from real device OCR noise (stars, leading dots, split columns)', () => {
    const text = `Energie ...
.....1146 kJI 2/1 kcal
Matières grasses...
dont acides gras saturés ....
****.***..
1,5 g
..0,3 g
39 g
.1,19
.9,7 g
...21g
..0,10 g
Glucides..
dont sucres...
Fibres alimentaires...
Protéines...
Sel...
Pour 100 g de produit cru
Energie...
1432 kJ / 339 kcal
Matieres grasses...
dont acides gras saturés ..
Glucides...
dont sucres...
Fibres alimentaires ...
Protéines ......
Sel..
Ce produit contient
...1.9 g
... 0,3 ğ
48 g
.1,49
... 12 g
...269
...0,13 g
environ 6 portions de 80 g.`;
    const result = parseNutritionLabel(text, 'fr');
    expect(result.carbsPer100g).toBe(48);
    expect(result.basis).toBe('raw');
    expect(result.name).toBeNull();
  });

  it('prefers dry table (53g) over cooked (11.7g) and infers raw basis', () => {
    const text = `dont aCIdes yids salul ts
Glucides
dont sucres
Fibres alimentaires
Protéines
Sel
Phosphore
0,2g
53 g
2,2g
19,5 9
21,7 9
0,03 g
444 mg
soit 63% des AQR
Pour 100g de produit cuit:
545 kJ/ 129 kcal
0,7 g
0,2g)
11,7g)
1
5,9 9)
15,6 9)
traces
120 mg
des AQR*
(Energie
Matières grasses
dont acides gras saturés
Glucides
dont sucres
(Fibres alimentaires
(Protéines
(Sel
Phosphore
soit 17%
Apports Quotidiens de Référence`;
    const result = parseNutritionLabel(text, 'fr');
    expect(result.carbsPer100g).toBe(53);
    expect(result.basis).toBe('raw');
    expect(result.name).toBeNull();
  });

  it('reads cooked-only table when no dry section exists', () => {
    const text = `Pour 100g de produit cuit:
545 kJ/ 129 kcal
0,7 g
0,2g)
11,7g)
1 g
5,9 g)
15,6 g)
traces
(Energie
Matières grasses
dont acides gras saturés
Glucides
dont sucres
(Fibres alimentaires
(Protéines
(Sel`;
    const result = parseNutritionLabel(text, 'fr');
    expect(result.carbsPer100g).toBe(11.7);
    expect(result.basis).toBe('cooked');
  });
});

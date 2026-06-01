export const unitSystems = ['metric', 'imperial'] as const;
export type UnitSystem = (typeof unitSystems)[number];

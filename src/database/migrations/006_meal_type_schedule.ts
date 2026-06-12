export const MIGRATION_006_SQL = `
ALTER TABLE app_preferences ADD COLUMN meal_type_schedule TEXT;
`;

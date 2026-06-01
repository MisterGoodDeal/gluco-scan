export const MIGRATION_003_SQL = `
CREATE TABLE IF NOT EXISTS app_preferences (
  id TEXT PRIMARY KEY NOT NULL CHECK (id = 'default'),
  theme_preference TEXT NOT NULL DEFAULT 'system',
  locale TEXT NOT NULL DEFAULT 'fr',
  unit_system TEXT NOT NULL DEFAULT 'metric'
);

INSERT OR IGNORE INTO app_preferences (id, theme_preference, locale, unit_system)
VALUES ('default', 'system', 'fr', 'metric');
`;

import fs from 'node:fs';
import path from 'node:path';

/**
 * Runs migrations in a simple single-file approach (teaching-focused).
 * For production, you would typically use a migration tool.
 *
 * @param {import('node:sqlite').DatabaseSync} db
 */
export function runMigrations(db) {
  const sqlPath = path.resolve('src/db/migrations/001_init.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  db.exec(sql);
}

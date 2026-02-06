import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Opens a SQLite database (file-backed or ':memory:') using node:sqlite.
 *
 * @param {string} dbPath
 * @returns {DatabaseSync}
 */
export function openDatabase(dbPath) {
  // Ensure dbPath is a string
  const dbPathStr = String(dbPath);

  // Ensure parent folder exists for file-backed DBs
  if (dbPathStr !== ':memory:') {
    const dir = path.dirname(dbPathStr);
    fs.mkdirSync(dir, { recursive: true });
  }

  const db = new DatabaseSync(dbPathStr, { open: true });

  // Enforce foreign keys
  db.exec('PRAGMA foreign_keys = ON;');

  return db;
}

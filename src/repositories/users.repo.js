/**
 * Day 3: in-memory users.
 *
 * @typedef {{ id: number, email: string, name: string, passwordHash: string }} User
 */
export function createUsersRepo(db) {
  /** @type {User[]} */
  const stmtInsert = db.prepare(`
    INSERT INTO users (email, name, password_hash)
    VALUES (?, ?, ?)
  `);

  const stmtByEmail = db.prepare(`
    SELECT id, email, name, password_hash AS passwordHash
    FROM users
    WHERE email = ?
    LIMIT 1
  `);

  return {
    create({ email, name, passwordHash }) {
      const info = stmtInsert.run(email, name, passwordHash);
      return { id: Number(info.lastInsertRowid), email, name, passwordHash };
    },

    findByEmail(email) {
      return stmtByEmail.get(email) ?? null;
    },
  };
}

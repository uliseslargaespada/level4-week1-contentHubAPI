/**
 * SQLite-backed posts repository.
 *
 * @param {import('node:sqlite').DatabaseSync} db
 */
export function createPostsRepo(db) {
  const stmtList = db.prepare(`
    SELECT id, title, body, author_id AS authorId, created_at AS createdAt, updated_at AS updatedAt
    FROM posts
    ORDER BY id DESC
    LIMIT ? OFFSET ?
  `);

  const stmtCount = db.prepare(`SELECT COUNT(*) AS total FROM posts`);

  const stmtGetById = db.prepare(`
    SELECT id, title, body, author_id AS authorId, created_at AS createdAt, updated_at AS updatedAt
    FROM posts
    WHERE id = ?
    LIMIT 1
  `);

  const stmtInsert = db.prepare(`
    INSERT INTO posts (title, body, author_id)
    VALUES (?, ?, ?)
  `);

  const stmtUpdate = db.prepare(`
    UPDATE posts
    SET title = ?, body = ?, updated_at = datetime('now')
    WHERE id = ? AND author_id = ?
  `);

  const stmtDelete = db.prepare(`
    DELETE FROM posts
    WHERE id = ? AND author_id = ?
  `);

  return {
    list({ limit = 20, offset = 0 } = {}) {
      const total = Number(stmtCount.get().total);
      const items = stmtList.all(limit, offset);
      return { items, total };
    },

    getById(id) {
      return stmtGetById.get(id) ?? null;
    },

    create({ title, body, authorId }) {
      const info = stmtInsert.run(title, body, authorId);
      return this.getById(Number(info.lastInsertRowid));
    },

    update({ id, title, body, authorId }) {
      const info = stmtUpdate.run(title, body, id, authorId);
      if (info.changes === 0) {
        const exists = this.getById(id);
        if (!exists) return null;
        return 'forbidden';
      }
      return this.getById(id);
    },

    delete({ id, authorId }) {
      const info = stmtDelete.run(id, authorId);
      if (info.changes === 0) {
        const exists = this.getById(id);
        if (!exists) return null;
        return 'forbidden';
      }
      return true;
    },
  };
}

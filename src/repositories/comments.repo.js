/**
 * SQLite-backed comments repository.
 *
 * @param {import('node:sqlite').DatabaseSync} db
 */
export function createCommentsRepo(db) {
  const stmtListForPost = db.prepare(`
    SELECT id, post_id AS postId, body, author_id AS authorId, created_at AS createdAt, updated_at AS updatedAt
    FROM comments
    WHERE post_id = ?
    ORDER BY id ASC
    LIMIT ? OFFSET ?
  `);

  const stmtCountForPost = db.prepare(`
    SELECT COUNT(*) AS total
    FROM comments
    WHERE post_id = ?
  `);

  const stmtInsert = db.prepare(`
    INSERT INTO comments (post_id, body, author_id)
    VALUES (?, ?, ?)
  `);

  const stmtUpdate = db.prepare(`
    UPDATE comments
    SET body = ?, updated_at = datetime('now')
    WHERE id = ? AND author_id = ?
  `);

  const stmtDelete = db.prepare(`
    DELETE FROM comments
    WHERE id = ? AND author_id = ?
  `);

  const stmtGetById = db.prepare(`
    SELECT id, post_id AS postId, body, author_id AS authorId, created_at AS createdAt, updated_at AS updatedAt
    FROM comments
    WHERE id = ?
    LIMIT 1
  `);

  return {
    listForPost(postId, { limit = 20, offset = 0 } = {}) {
      const total = Number(stmtCountForPost.get(postId).total);
      const items = stmtListForPost.all(postId, limit, offset);
      return { items, total };
    },

    create({ postId, body, authorId }) {
      const info = stmtInsert.run(postId, body, authorId);
      return stmtGetById.get(Number(info.lastInsertRowid));
    },

    update({ id, body, authorId }) {
      const info = stmtUpdate.run(body, id, authorId);
      if (info.changes === 0) {
        const exists = stmtGetById.get(id);
        if (!exists) return null;
        return 'forbidden';
      }
      return stmtGetById.get(id);
    },

    delete({ id, authorId }) {
      const info = stmtDelete.run(id, authorId);
      if (info.changes === 0) {
        const exists = stmtGetById.get(id);
        if (!exists) return null;
        return 'forbidden';
      }
      return true;
    },
  };
}

/**
 * Comments repository backed by Prisma.
 *
 * @param {import('@prisma/client').PrismaClient} prisma
 */
export function createCommentsRepo(prisma) {
  return {
    /**
     * List comments for a given post.
     *
     * @param {string} postId
     * @param {{ limit?: number, offset?: number }} params
     */
    async listForPost(postId, { limit = 50, offset = 0 } = {}) {
      const [items, total] = await Promise.all([
        prisma.comment.findMany({
          where: { postId },
          skip: offset,
          take: limit,
          orderBy: { createdAt: 'asc' },
        }),
        prisma.comment.count({ where: { postId } }),
      ]);

      return { items, total };
    },

    /**
     * Get comment by id.
     *
     * @param {string} id
     */
    async getById(id) {
      return prisma.comment.findUnique({ where: { id } });
    },

    /**
     * Create a comment.
     *
     * @param {{ postId: string, body: string, authorId: string }} data
     */
    async create({ postId, body, authorId }) {
      return prisma.comment.create({
        data: { postId, body, authorId },
      });
    },

    /**
     * Update a comment if exists and user owns it.
     *
     * Returns: updated | null | 'forbidden'
     *
     * @param {{ id: string, body: string, authorId: string }} data
     */
    async update({ id, body, authorId }) {
      const existing = await prisma.comment.findUnique({ where: { id } });
      if (!existing) return null;
      if (existing.authorId !== authorId) return 'forbidden';

      return prisma.comment.update({
        where: { id },
        data: { body },
      });
    },

    /**
     * Delete a comment if exists and user owns it.
     *
     * Returns: true | null | 'forbidden'
     *
     * @param {{ id: string, authorId: string }} data
     */
    async delete({ id, authorId }) {
      const existing = await prisma.comment.findUnique({ where: { id } });
      if (!existing) return null;
      if (existing.authorId !== authorId) return 'forbidden';

      await prisma.comment.delete({ where: { id } });
      return true;
    },
  };
}

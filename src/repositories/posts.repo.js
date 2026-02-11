/**
 * Posts repository backed by Prisma.
 *
 * @param {import('@prisma/client').PrismaClient} prisma
 */
export function createPostsRepo(prisma) {
  return {
    /**
     * List posts with pagination.
     *
     * @param {{ limit?: number, offset?: number }} params
     */
    async list({ limit = 20, offset = 0 } = {}) {
      const [items, total] = await Promise.all([
        prisma.post.findMany({
          skip: offset,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.post.count(),
      ]);

      return { items, total };
    },

    /**
     * Get a post by id.
     *
     * @param {string} id
     */
    async getById(id) {
      return prisma.post.findUnique({ where: { id } });
    },

    /**
     * Create a post.
     *
     * @param {{ title: string, body: string, authorId: string }} data
     */
    async create({ title, body, authorId }) {
      return prisma.post.create({
        data: { title, body, authorId },
      });
    },

    /**
     * Update a post if exists and user owns it.
     *
     * Returns:
     * - updated post object
     * - null (not found)
     * - 'forbidden' (not owner)
     *
     * @param {{ id: string, title: string, body: string, authorId: string }} data
     */
    async update({ id, title, body, authorId }) {
      const existing = await prisma.post.findUnique({ where: { id } });
      if (!existing) return null;
      if (existing.authorId !== authorId) return 'forbidden';

      return prisma.post.update({
        where: { id },
        data: { title, body },
      });
    },

    /**
     * Delete a post if exists and user owns it.
     *
     * Returns:
     * - true (deleted)
     * - null (not found)
     * - 'forbidden' (not owner)
     *
     * @param {{ id: string, authorId: string }} data
     */
    async delete({ id, authorId }) {
      const existing = await prisma.post.findUnique({ where: { id } });
      if (!existing) return null;
      if (existing.authorId !== authorId) return 'forbidden';

      await prisma.post.delete({ where: { id } });
      return true;
    },
  };
}

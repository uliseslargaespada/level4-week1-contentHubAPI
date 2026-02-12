/**
 * Posts repository backed by Prisma.
 *
 * NOTE:
 * This layer does NOT decide HTTP status codes.
 * It returns data and special markers where needed.
 *
 * @param {import('../../generated/prisma/index.js').PrismaClient} prisma
 */
export function createPostsRepo(prisma) {
  return {
    /**
     * List posts with pagination.
     *
     * @param {{ limit?: number, offset?: number, includeCounts?: boolean }} params
     */
    async list({ limit = 20, offset = 0, includeCounts = false } = {}) {
      const include = includeCounts ? { _count: { select: { comments: true } } } : undefined;

      const [items, total] = await Promise.all([
        prisma.post.findMany({
          skip: offset,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include,
        }),
        prisma.post.count(),
      ]);

      return { items, total };
    },

    /**
     * Get a post by id (no includes).
     *
     * @param {string} id
     */
    async getById(id) {
      return prisma.post.findUnique({ where: { id } });
    },

    /**
     * Get a post by id with optional includes.
     *
     * @param {string} id
     * @param {{ includeAuthor?: boolean, includeComments?: boolean }} options
     */
    async getByIdWithIncludes(id, { includeAuthor = false, includeComments = false } = {}) {
      const include = {};

      if (includeAuthor) {
        include.author = {
          select: { id: true, name: true, email: true, createdAt: true },
        };
      }

      if (includeComments) {
        include.comments = {
          orderBy: { createdAt: 'asc' },
          include: {
            author: {
              select: { id: true, name: true, email: true, createdAt: true },
            },
          },
        };
      }

      return prisma.post.findUnique({
        where: { id },
        include: Object.keys(include).length ? include : undefined,
      });
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

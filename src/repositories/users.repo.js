/**
 * Users repository backed by Prisma.
 *
 * Responsibility:
 * - Minimal DB access for users.
 * - No HTTP concerns here (no res objects, no status codes).
 *
 * @param {import('@prisma/client').PrismaClient} prisma
 */
export function createUsersRepo(prisma) {
  return {
    /**
     * Create a user.
     *
     * @param {{ email: string, name: string, passwordHash: string }} data
     */
    async create(data) {
      return prisma.user.create({ data });
    },

    /**
     * Find a user by email.
     *
     * @param {string} email
     */
    async findByEmail(email) {
      return prisma.user.findUnique({ where: { email } });
    },

    /**
     * Find a user by id.
     *
     * @param {string} id
     */
    async findById(id) {
      return prisma.user.findUnique({ where: { id } });
    },
  };
}

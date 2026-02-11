import { ensureEnv } from '#utils/env';
import { createApp } from '#app';
import { createRepos } from '#repositories/index';
import { prisma } from './db/prisma.js';

const env = ensureEnv();

const repos = await createRepos(prisma);

// The main app
const app = createApp({
  repos,
  config: { JWT_SECRET: env.JWT_SECRET },
});

// Start the server
app.listen(env.PORT, () => {
  console.log(`ContentHub API listening on http://localhost:${env.PORT}`);
});

/**
 * Graceful shutdown closes DB connections.
 */
async function shutdown() {
  await prisma.$disconnect();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

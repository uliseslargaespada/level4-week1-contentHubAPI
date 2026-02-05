import { ensureEnv } from '#utils/env';
import { createApp } from '#app';
import { createRepos } from '#repositories/index';

const env = ensureEnv();
const repos = await createRepos();

// The main app
const app = createApp({
  repos,
  config: { JWT_SECRET: env.JWT_SECRET },
});

// Start the server
app.listen(env.PORT, () => {
  console.log(`ContentHub API listening on http://localhost:${env.PORT}`);
});

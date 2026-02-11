import { notFound, forbidden } from '#utils/httpErrors';
import { ensureBodyFields } from '#utils/guard';
import { parsePagination } from '#utils/pagination';

/**
 * GET /posts
 */
export async function listPosts(req, res) {
  const { posts } = res.locals.repos;

  const { limit, offset } = parsePagination(req.query);
  const result = await posts.list({ limit, offset });

  return res.ok(result.items, {
    pagination: { limit, offset, total: result.total },
  });
}

/**
 * GET /posts/:id
 */
export async function getPost(req, res) {
  const { posts } = res.locals.repos;

  // Get an id from the requests
  const id = req.params.id;

  const post = await posts.getById(id);

  if (!post) {
    throw notFound('Post not found');
  }

  return res.ok(post);
}

/**
 * POST /posts (AUTH REQUIRED)
 */
export async function createPost(req, res) {
  const { posts } = res.locals.repos;
  ensureBodyFields(req.body, ['title', 'body']);

  const { title, body } = req.body ?? {};

  const created = await posts.create({ title, body, authorId: req.user.id });

  return res.status(201).json({ data: created });
}

/**
 * PUT /posts/:id (AUTH + OWNER)
 */
export async function updatePost(req, res) {
  const { posts } = res.locals.repos;
  const id = req.params.id;

  ensureBodyFields(req.body, ['title', 'body']);

  const updated = await posts.update({
    id,
    title: req.body.title,
    body: req.body.body,
    authorId: req.user.id,
  });

  if (updated === null) throw notFound('Post not found');
  if (updated === 'forbidden') throw forbidden('You do not own this post');

  return res.ok(updated);
}

/**
 * DELETE /posts/:id (AUTH + OWNER)
 */
export async function deletePost(req, res) {
  const { posts } = res.locals.repos;
  const id = req.params.id;

  const result = await posts.delete({ id, authorId: req.user.id });

  if (result === null) throw notFound('Post not found');
  if (result === 'forbidden') throw forbidden('You do not own this post');

  return res.noContent();
}

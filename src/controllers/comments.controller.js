import { forbidden, notFound } from '#utils/httpErrors';
import { ensureBodyFields, ensure } from '#utils/guard';
import { parsePagination } from '#utils/pagination';

/**
 * GET /posts/:postId/comments
 */
export async function listCommentsForPost(req, res) {
  const { posts, comments } = res.locals.repos;
  const postId = req.params.postId;

  ensure(posts.getById(postId), notFound('Post not found'));

  const { limit, offset } = parsePagination(req.query);
  const result = await comments.listForPost(postId, { limit, offset });

  return res.ok(result.items, {
    pagination: { limit, offset, total: result.total },
  });
}

/**
 * POST /posts/:postId/comments (AUTH REQUIRED)
 */
export async function createCommentForPost(req, res) {
  const { posts, comments } = res.locals.repos;
  const postId = req.params.postId;

  ensure(posts.getById(postId), notFound('Post not found'));
  ensureBodyFields(req.body, ['body']);

  const created = await comments.create({
    postId,
    body: req.body.body,
    authorId: req.user.id,
  });

  return res.created(created);
}

/**
 * PUT /comments/:id (AUTH + OWNER)
 */
export async function updateComment(req, res) {
  const { comments } = res.locals.repos;
  const id = req.params.id;

  ensureBodyFields(req.body, ['body']);

  const updated = await comments.update({
    id,
    body: req.body.body,
    authorId: req.user.id,
  });

  if (updated === null) throw notFound('Comment not found');
  if (updated === 'forbidden') throw forbidden('You do not own this comment');

  return res.ok(updated);
}

/**
 * DELETE /comments/:id (AUTH + OWNER)
 */
export async function deleteComment(req, res) {
  const { comments } = res.locals.repos;
  const id = req.params.id;

  const result = await comments.delete({ id, authorId: req.user.id });

  if (result === null) throw notFound('Comment not found');
  if (result === 'forbidden') throw forbidden('You do not own this comment');

  return res.noContent();
}

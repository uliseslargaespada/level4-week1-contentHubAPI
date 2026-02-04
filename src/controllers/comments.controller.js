import { notFound } from '#utils/httpErrors';
import { ensureBodyFields, ensure } from '#utils/guard';
import { parsePagination } from '#utils/pagination';

/**
 * GET /posts/:postId/comments
 */
export function listCommentsForPost(req, res) {
  const { posts, comments } = res.locals.repos;
  const postId = Number(req.params.postId);

  // Clear teaching step: ensure post exists before listing comments.
  ensure(posts.getById(postId), notFound('Post not found'));

  const { limit, offset } = parsePagination(req.query);
  const result = comments.listForPost(postId, { limit, offset });

  return res.ok(result.items, {
    pagination: { limit, offset, total: result.total },
  });
}

/**
 * POST /posts/:postId/comments
 */
export function createCommentForPost(req, res) {
  const { posts, comments } = res.locals.repos;
  const postId = Number(req.params.postId);

  ensure(posts.getById(postId), notFound('Post not found'));
  ensureBodyFields(req.body, ['body']);

  const created = comments.create({
    postId,
    body: req.body.body,
  });

  return res.created(created);
}

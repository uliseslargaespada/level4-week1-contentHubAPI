import { Router } from 'express';
import { listPosts, createPost, getPost } from '#controllers/posts.controller';
import { listCommentsForPost, createCommentForPost } from '#controllers/comments.controller';

export const postsRouter = Router();

postsRouter.get('/', listPosts);
postsRouter.get('/:id', getPost);
postsRouter.post('/', createPost);

// Nest the comments inside a post
postsRouter.get('/:postId/comments', listCommentsForPost);
postsRouter.post('/:postId/comments', createCommentForPost);

import { Router } from 'express';
import { listPosts, createPost, getPost } from '#controllers/posts.controller';

export const postsRouter = Router();

postsRouter.get('/', listPosts);
postsRouter.get('/:id', getPost);
postsRouter.post('/', createPost);

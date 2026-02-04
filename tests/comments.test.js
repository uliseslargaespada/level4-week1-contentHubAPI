// tests/comments.test.js
import { describe, it, expect } from 'vitest';
import request from 'supertest';

import { createApp } from '../src/createApp.js';
import { createRepos } from '../src/repositories/index.js';

describe('Comments (nested)', () => {
  it('creates and lists comments for a post', async () => {
    const app = createApp({ repos: await createRepos() });

    const postRes = await request(app).post('/posts').send({ title: 'A', body: '1' }).expect(201);
    const postId = postRes.body.data.id;

    const createComment = await request(app)
      .post(`/posts/${postId}/comments`)
      .send({ body: 'Nice!' })
      .expect(201);

    expect(createComment.body.data.postId).toBe(postId);

    const list = await request(app).get(`/posts/${postId}/comments`).expect(200);
    expect(list.body.data).toHaveLength(1);
  });

  it('returns 404 when post does not exist', async () => {
    const app = createApp({ repos: await createRepos() });

    const res = await request(app).post('/posts/9999/comments').send({ body: 'x' }).expect(404);
    expect(res.body.error.code).toBe('not_found');
  });
});

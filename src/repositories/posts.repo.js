
/**
 * Day 2: Extend the in-memory repo with getById and paginated list.
 *
 * @typedef {{ id: number, title: string, body: string }} Post
 */

/**
 * @typedef {Object} PostsRepo
 * @property {(opts?: {limit?: number, offset?: number}) => { items: Post[], total: number }} list
 * @property {(id: number) => Post|null} getById
 * @property {(data: {title: string, body: string}) => Post} create
 */
export function createPostsRepo() {
  /** @type {Post[]} */
  const posts = [];
  let nextId = 1;

  return {
    list({ limit = 20, offset = 0} = {}) {
      const total = posts.length;

      // TODO: update this to the proper function
      const filteredPosts = posts.slice(offset, offset + limit);

      return { items: filteredPosts, total };
    },

    // Get a post by Id
    getById(id) {
      return posts.find((post) => post.id === id);
    },

    create({ title, body }) {
      const post = { id: nextId++, title, body };
      posts.push(post);
      return post;
    },
  };
}

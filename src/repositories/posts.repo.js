/**
 * @typedef {{ id: number, title: string, body: string }} Post
 */

/**
 * @typedef {Object} PostsRepo
 * @property {() => Post[]} list
 * @property {(data: {title: string, body: string}) => Post} create
 */

export function createPostsRepo() {
  /** @type {Post[]} */
  const posts = [];
  let nextId = 1;

  return {
    list() {
      return posts;
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

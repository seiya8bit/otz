import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import {
  pathPostsDelete,
  pathPostsGet,
  pathPostsUpdate,
  queryPostsList,
  schemaPostCreate,
  schemaPostUpdate,
} from '../gen/openapi.js'

export const postRouter = new Hono()

postRouter.get(
  '/posts',
  zValidator('query', queryPostsList),
  async (c) => {
    const query = c.req.valid('query')

    const limit = Number.parseInt(query.limit ?? '20')
    const offset = Number.parseInt(query.offset ?? '0')

    return c.json({
      limit,
      offset,
      total: 10,
      // return posts
      items: [],
    })
  },
)

postRouter.get(
  '/posts/:id',
  zValidator('param', pathPostsGet),
  async (c) => {
    const param = c.req.valid('param')

    const id = param.id
    if (!id) {
      return c.json({ error: 'Bad request' }, 400)
    }

    return c.json({
      // return post
    })
  },
)

postRouter.post(
  '/posts',
  zValidator('json', schemaPostCreate),
  async (c) => {
    const json = c.req.valid('json')

    // INSERT INTO posts ...

    return c.json({
      // return post
    })
  },
)

postRouter.patch(
  '/posts/:id',
  zValidator('param', pathPostsUpdate),
  zValidator('json', schemaPostUpdate),
  async (c) => {
    const param = c.req.valid('param')
    const json = c.req.valid('json')

    // UPDATE posts SET ...

    return c.json({
      // return post
    })
  },
)

postRouter.delete(
  '/posts/:id',
  zValidator('param', pathPostsDelete),
  async (c) => {
    const param = c.req.valid('param')

    // DELETE FROM posts ...

    return c.body(null, 204)
  },
)

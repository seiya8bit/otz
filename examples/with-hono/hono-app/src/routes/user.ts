import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import {
  pathUsersDelete,
  pathUsersGet,
  pathUsersUpdate,
  queryUsersList,
  schemaUserCreate,
  schemaUserUpdate,
} from '../gen/openapi.js'

export const userRouter = new Hono()

userRouter.get(
  '/users',
  zValidator('query', queryUsersList),
  async (c) => {
    const query = c.req.valid('query')

    const limit = Number.parseInt(query.limit ?? '20')
    const offset = Number.parseInt(query.offset ?? '0')

    return c.json({
      limit,
      offset,
      total: 10,
      // return users
      items: [],
    })
  },
)

userRouter.get(
  '/users/:id',
  zValidator('param', pathUsersGet),
  async (c) => {
    const param = c.req.valid('param')

    const id = param.id
    if (!id) {
      return c.json({ error: 'Bad request' }, 400)
    }

    return c.json({
      // return user
    })
  },
)

userRouter.post(
  '/users',
  zValidator('json', schemaUserCreate),
  async (c) => {
    const json = c.req.valid('json')

    // INSERT INTO users ...

    return c.json({
      // return user
    })
  },
)

userRouter.patch(
  '/users/:id',
  zValidator('param', pathUsersUpdate),
  zValidator('json', schemaUserUpdate),
  async (c) => {
    const param = c.req.valid('param')
    const json = c.req.valid('json')

    // UPDATE users SET ...

    return c.json({
      // return user
    })
  },
)

userRouter.delete(
  '/users/:id',
  zValidator('param', pathUsersDelete),
  async (c) => {
    const param = c.req.valid('param')

    // DELETE FROM users ...

    return c.body(null, 204)
  },
)

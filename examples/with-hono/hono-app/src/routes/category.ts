import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import {
  pathCategoriesDelete,
  pathCategoriesGet,
  pathCategoriesUpdate,
  queryCategoriesList,
  schemaCategoryCreate,
  schemaCategoryUpdate,
} from '../gen/openapi.js'

export const categoryRouter = new Hono()

categoryRouter.get(
  '/categories',
  zValidator('query', queryCategoriesList),
  async (c) => {
    const query = c.req.valid('query')

    const limit = Number.parseInt(query.limit ?? '20')
    const offset = Number.parseInt(query.offset ?? '0')

    return c.json({
      limit,
      offset,
      total: 10,
      // return categories
      items: [],
    })
  },
)

categoryRouter.get(
  '/categories/:id',
  zValidator('param', pathCategoriesGet),
  async (c) => {
    const param = c.req.valid('param')

    const id = param.id
    if (!id) {
      return c.json({ error: 'Bad request' }, 400)
    }

    return c.json({
      // return category
    })
  },
)

categoryRouter.post(
  '/categories',
  zValidator('json', schemaCategoryCreate),
  async (c) => {
    const json = c.req.valid('json')

    // INSERT INTO categories ...

    return c.json({
      // return category
    })
  },
)

categoryRouter.patch(
  '/categories/:id',
  zValidator('param', pathCategoriesUpdate),
  zValidator('json', schemaCategoryUpdate),
  async (c) => {
    const param = c.req.valid('param')
    const json = c.req.valid('json')

    // UPDATE categories SET ...

    return c.json({
      // return category
    })
  },
)

categoryRouter.delete(
  '/categories/:id',
  zValidator('param', pathCategoriesDelete),
  async (c) => {
    const param = c.req.valid('param')

    // DELETE FROM categories ...

    return c.body(null, 204)
  },
)

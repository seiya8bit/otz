import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { categoryRouter, postRouter, userRouter } from './routes/index.js'

const app = new Hono()

// Category
app.route('/', categoryRouter)

// Post
app.route('/', postRouter)

// User
app.route('/', userRouter)

const port = 3000
serve({ fetch: app.fetch, port })

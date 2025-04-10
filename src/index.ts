import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import { serveStatic } from '@hono/node-server/serve-static'
import { join } from 'path'
import swaggerDocument from './docs/openapi.json'
import { Routes } from './routes'
import { errorHandler } from './middlewares/errorHandler'

const app = new Hono().basePath('/api')

// Middleware global
app.use('*', logger())
app.use('*', cors())
app.use('*', errorHandler)

// Serve static files from /public folder (e.g., /public/assets/game/domino.png -> /api/assets/game/domino.png)
app.use('/assets/*', serveStatic({ root: join(process.cwd(), 'public') }))

// API Routes
app.route('/', Routes)

// Swagger UI
app.get('/docs', (c) =>
  c.html(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Swagger UI</title>
        <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css" />
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
        <script>
          SwaggerUIBundle({
            url: '/api/docs/openapi.json',
            dom_id: '#swagger-ui'
          })
        </script>
      </body>
    </html>
  `)
)

// Serve Swagger JSON
app.get('/docs/openapi.json', (c) => c.json(swaggerDocument))

const PORT = process.env.PORT || 3000
Bun.serve({
  fetch : app.fetch,
  port : Number(PORT)
})


export default app
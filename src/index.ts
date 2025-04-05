import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import { errorHandler } from './middlewares/errorHandler'
import { Routes } from './routes'
import swaggerDocument from './docs/openapi.json'
import serveStatic from 'serve-static'
import swaggerUI from 'swagger-ui-dist'
import { join } from 'path'

const app = new Hono().basePath('/api')

app.use('*', errorHandler)
app.use('*', logger())
app.use('*', cors())

app.route('/', Routes)

// Serve static assets from swagger-ui-dist
app.get('/docs', (c) => {
  return c.html(`
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
})
// Serve openapi.json
app.get('/docs/openapi.json', (c) => c.json(swaggerDocument))

// Swagger HTML page
app.get('/docs', (c) =>
  c.html(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Swagger UI</title>
        <link rel="stylesheet" href="/api/docs/swagger-ui.css" />
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="/api/docs/swagger-ui-bundle.js"></script>
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

export default app
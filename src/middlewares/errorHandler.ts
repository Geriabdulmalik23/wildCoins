import { Context, Next } from 'hono'
import type { StatusCode } from 'hono/utils/http-status'
import { createResponse } from '../helper/responseHelper'
import { HttpException } from '../utils/HttpException'

export const errorHandler = async (c: Context, next: Next) => {
  try {
    await next()
  } catch (err: any) {
    console.error('[ERROR]', err)

    const status = (err instanceof HttpException ? err.status : 500) as StatusCode
    const message = err.message || 'Internal Server Error'
    const errors = err instanceof HttpException ? err.errors : null

    c.status(status)
    return c.json(
      createResponse(false, message, null, errors)
    )
  }
}
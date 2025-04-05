import { Hono } from 'hono'
import { getProfile } from '../controllers/authController'
import { jwtMiddleware } from '../middlewares/jwtMiddleware'

const userRoutes = new Hono()
userRoutes.use('*', jwtMiddleware)
// Route ini membutuhkan JWT untuk akses
userRoutes.get('/profile', jwtMiddleware, (c) => getProfile(c))

export default userRoutes
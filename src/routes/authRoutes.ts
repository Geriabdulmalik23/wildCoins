import { Hono } from 'hono'
import { login, register } from '../controllers/authController'

const authRoutes = new Hono()

authRoutes.post('/login', (c) => login(c))
authRoutes.post('/register', (c) => register(c))

export default authRoutes
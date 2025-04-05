
//import hono
import { Hono } from 'hono'

import blogRoutes from './blogRoutes'
import authRoutes from './authRoutes'
import userRoutes from './userRoutes'
import productRoutes from './productRoutes'
import transactionRoutes from './transactionRoutes'
import productPackageRoutes from './productPackageRoutes'
import paymentRoutes from './paymentRoutes'
const router = new Hono()

/** Blog */
router.route('/blog', blogRoutes)
/** Auth */
router.route('/auth', authRoutes)
/** User */
router.route('/user', userRoutes)
/** Product */
router.route('/product', productRoutes)
router.route('/product-packages', productPackageRoutes)

router.route('/transactions',transactionRoutes)
router.route('/payments',paymentRoutes)


export const Routes = router
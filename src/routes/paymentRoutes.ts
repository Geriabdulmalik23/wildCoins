import { Hono } from 'hono'
import {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment
} from '../controllers/paymentController'

const paymentRoutes = new Hono()

paymentRoutes.get('/', (c) => getAllPayments(c))
paymentRoutes.get('/:id', (c) => getPaymentById(c))
paymentRoutes.post('/', (c) => createPayment(c))
paymentRoutes.put('/:id', (c) => updatePayment(c))
paymentRoutes.delete('/:id', (c) => deletePayment(c))

export default paymentRoutes
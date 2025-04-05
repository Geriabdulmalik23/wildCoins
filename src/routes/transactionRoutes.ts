import { Hono } from 'hono'

import {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransactionStatus,
} from "../controllers/transactionController";
import { jwtMiddleware } from "../middlewares/jwtMiddleware";

const transactionRoutes = new Hono();

transactionRoutes.get('/', jwtMiddleware, getAllTransactions);
transactionRoutes.get('/:id', jwtMiddleware, getTransactionById);
transactionRoutes.post('/', jwtMiddleware, createTransaction);
transactionRoutes.put('/:id/status', jwtMiddleware, updateTransactionStatus);

export default transactionRoutes;
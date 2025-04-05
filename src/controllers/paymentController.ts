import { Context } from 'hono'
import prisma from '../../prisma/client'
import { createResponse } from '../helper/responseHelper'

export const getAllPayments = async (c: Context) => {
  try {
    const payments = await prisma.payment.findMany()
    return c.json(createResponse(true, 'Success get all payment methods', payments))
  } catch (error) {
    console.error(error)
    return c.json(createResponse(false, 'Failed to get payment methods'), 500)
  }
}

export const getPaymentById = async (c: Context) => {
  try {
    const id = Number(c.req.param('id'))
    const payment = await prisma.payment.findUnique({ where: { id } })

    if (!payment) {
      return c.json(createResponse(false, 'Payment method not found'), 404)
    }

    return c.json(createResponse(true, 'Success get payment method detail', payment))
  } catch (error) {
    console.error(error)
    return c.json(createResponse(false, 'Failed to get payment method'), 500)
  }
}

export const createPayment = async (c: Context) => {
  try {
    const body = await c.req.json()
    const { name, type, imageUrl } = body

    const newPayment = await prisma.payment.create({
      data: { name, type, imageUrl }
    })

    return c.json(createResponse(true, 'Payment method created successfully', newPayment), 201)
  } catch (error) {
    console.error(error)
    return c.json(createResponse(false, 'Failed to create payment method'), 500)
  }
}

export const updatePayment = async (c: Context) => {
  try {
    const id = Number(c.req.param('id'))
    const body = await c.req.json()
    const { name, type, imageUrl } = body

    const updated = await prisma.payment.update({
      where: { id },
      data: { name, type, imageUrl }
    })

    return c.json(createResponse(true, 'Payment method updated successfully', updated))
  } catch (error) {
    console.error(error)
    return c.json(createResponse(false, 'Failed to update payment method'), 500)
  }
}

export const deletePayment = async (c: Context) => {
  try {
    const id = Number(c.req.param('id'))

    await prisma.payment.delete({ where: { id } })

    return c.json(createResponse(true, 'Payment method deleted successfully'))
  } catch (error) {
    console.error(error)
    return c.json(createResponse(false, 'Failed to delete payment method'), 500)
  }
}
//Import Context
import { Context } from 'hono';

//Import Prism Client
import prisma from '../../prisma/client';
import { createResponse } from '../helper/responseHelper';
import { randomUUIDv7 } from 'bun';


export const getAllTransactions = async (c: Context) => {
  const userId = c.get("userId");

  const transactions = await prisma.transaction.findMany({
    where: { userId },
    include: {
      productPackage: {
        include: {
          product: true,
        },
      },
      userProductAccount: {
        include: {
          product: true,
        },
      },
      payment: true,
    },
    orderBy: {
      transactionDate: "desc",
    },
  });

  return c.json(createResponse(true, "Success get all transactions", transactions));
};

export const getTransactionById = async (c: Context) => {
  const id = parseInt(c.req.param("id"));
  const transaction = await prisma.transaction.findUnique({
    where: { id },
    include: {
      productPackage: {
        include: {
          product: true,
        },
      },
      userProductAccount: {
        include: {
          product: true,
        },
      },
      payment: true,
    },
  });

  if (!transaction) {
    return c.json(createResponse(false, "Transaction not found", null), 404);
  }

  return c.json(createResponse(true, "Success get transaction", transaction));
};

export const createTransaction = async (c: Context) => {
  const userId = c.get("userId");
  const body = await c.req.json();

  const {
    productPackageId,
    userProductAccountId,
    paymentId,
  } = body;

  const packageData = await prisma.productPackage.findUnique({
    where: { id: productPackageId },
  });

  if (!packageData) {
    return c.json(createResponse(false, "Product package not found", null), 404);
  }

  const totalPrice = packageData.price;
  const invoiceNumber = `INV-${randomUUIDv7()}`;

  const transaction = await prisma.transaction.create({
    data: {
      userId,
      productPackageId,
      userProductAccountId,
      paymentId,
      invoiceNumber,
      totalPrice,
      status: "PENDING",
    },
  });

  return c.json(createResponse(true, "Transaction created successfully", transaction));
};

export const updateTransactionStatus = async (c: Context) => {
  const id = parseInt(c.req.param("id"));
  const { status } = await c.req.json();

  const validStatus = ["PENDING", "SUCCESS", "FAILED"];
  if (!validStatus.includes(status)) {
    return c.json(createResponse(false, "Invalid status", null), 400);
  }

  const updated = await prisma.transaction.update({
    where: { id },
    data: { status },
  });

  return c.json(createResponse(true, "Transaction status updated", updated));
};
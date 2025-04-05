import { Context } from 'hono';
import prisma from '../../prisma/client';
import { createResponse } from '../helper/responseHelper';

// Ambil semua paket produk
export const getAllProductPackages = async (c: Context) => {
  try {
    const packages = await prisma.productPackage.findMany({
      include: {
        product: true,
      }
    });

    return c.json(createResponse(true, "Success get all product packages", packages));
  } catch (error) {
    console.error(error);
    return c.json(createResponse(false, "Failed to get product packages"), 500);
  }
};

// Ambil paket berdasarkan productId (query param ?productId=1)
export const getPackagesByProductId = async (c: Context) => {
  try {
    const productId = Number(c.req.query('productId'));

    if (!productId) {
      return c.json(createResponse(false, "Parameter productId diperlukan"), 400);
    }

    const packages = await prisma.productPackage.findMany({
      where: { productId },
    });

    return c.json(createResponse(true, "Success get packages by productId", packages));
  } catch (error) {
    console.error(error);
    return c.json(createResponse(false, "Failed to get packages by productId"), 500);
  }
};

// Ambil detail paket berdasarkan id (param :id)
export const getProductPackageById = async (c: Context) => {
  try {
    const id = Number(c.req.param('id'));

    const productPackage = await prisma.productPackage.findUnique({
      where: { id },
      include: {
        product: true,
      }
    });

    if (!productPackage) {
      return c.json(createResponse(false, "Product package not found"), 404);
    }

    return c.json(createResponse(true, "Success get product package detail", productPackage));
  } catch (error) {
    console.error(error);
    return c.json(createResponse(false, "Failed to get product package detail"), 500);
  }
};
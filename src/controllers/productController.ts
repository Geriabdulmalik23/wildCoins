// controllers/productController.ts
import { Context } from 'hono'
import prisma from '../../prisma/client'
import { createResponse } from '../helper/responseHelper'

// Ambil semua kategori produk
export const getAllCategories = async (c: Context) => {
  try {
    const categories = await prisma.productCategory.findMany()
    return c.json(createResponse(true, "Success get all categories", categories))
  } catch (error) {
    console.error(error)
    return c.json(createResponse(false, "Gagal memuat kategori"), 500)
  }
}

// Ambil semua produk
export const getAllProducts = async (c: Context) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        packages: true
      }
    })
    return c.json(createResponse(true, "Success get all products", products))
  } catch (error) {
    console.error(error)
    return c.json(createResponse(false, "Gagal memuat produk"), 500)
  }
}

// Ambil produk berdasarkan kategori (pakai query param: ?categoryId=1)
export const getProductsByCategory = async (c: Context) => {
  try {
    const categoryId = Number(c.req.query('categoryId'))
    if (!categoryId) {
      return c.json(createResponse(false, "Parameter categoryId diperlukan"), 400)
    }

    const products = await prisma.product.findMany({
      where: { categoryId },
      include: {
        packages: true
      }
    })

    return c.json(createResponse(true, "Success get products by category", products))
  } catch (error) {
    console.error(error)
    return c.json(createResponse(false, "Gagal memuat produk berdasarkan kategori"), 500)
  }
}

// Ambil detail produk dan semua paket berdasarkan productId (param :id)
export const getProductWithPackages = async (c: Context) => {
  try {
    const id = Number(c.req.param('id'))

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        packages: true
      }
    })

    if (!product) {
      return c.json(createResponse(false, "Produk tidak ditemukan"), 404)
    }

    return c.json(createResponse(true, "Success get product detail", product))
  } catch (error) {
    console.error(error)
    return c.json(createResponse(false, "Gagal memuat detail produk"), 500)
  }
}
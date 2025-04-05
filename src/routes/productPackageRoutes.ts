import { Hono } from 'hono'
import {
  getAllProductPackages,
  getPackagesByProductId,
  getProductPackageById
} from '../controllers/productPackageController'

const productPackageRoutes = new Hono()

// Ambil semua paket produk
productPackageRoutes.get('/', (c) => getAllProductPackages(c))

// Ambil paket berdasarkan productId (pakai query param ?productId=1)
productPackageRoutes.get('/by-product', (c) => getPackagesByProductId(c))

// Ambil detail paket berdasarkan id
productPackageRoutes.get('/:id', (c) => getProductPackageById(c))

export default productPackageRoutes
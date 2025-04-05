import { Hono } from 'hono'
import {
  getAllCategories,
  getProductsByCategory,
  getAllProducts,
  getProductWithPackages
} from '../controllers/productController'

const productRoutes = new Hono()

// Ambil semua kategori produk
productRoutes.get('/categories', (c) => getAllCategories(c))

// Ambil semua produk
productRoutes.get('/', (c) => getAllProducts(c))

// Ambil produk berdasarkan kategori (optional, pakai query param ?categoryId=1)
productRoutes.get('/by-category', (c) => getProductsByCategory(c))

// Ambil detail produk + paket-paketnya
productRoutes.get('/:id', (c) => getProductWithPackages(c))

export default productRoutes
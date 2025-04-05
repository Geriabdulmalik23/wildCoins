To install dependencies:
```sh
bun install
```

To run:
```sh
bun run dev
```

open http://localhost:3000

# wildCoins

# 📘 HonoJS API Standard Response & Error Handler Guide

Dokumentasi ini menjelaskan cara menggunakan helper `createResponse` dan `errorHandler` untuk membangun respons API yang konsisten dan mudah dipahami dalam proyek HonoJS Anda.

---

## ✅ Standar Format Response

### ✔️ Sukses
```json
{
  "success": true,
  "message": "Data berhasil diambil",
  "data": { /* isi data */ },
  "meta": {
    "timestamp": "2025-04-05T12:00:00.000Z"
  }
}
```

### ❌ Gagal
```json
{
  "success": false,
  "message": "Terjadi kesalahan",
  "data": {},
  "meta": {
    "timestamp": "2025-04-05T12:00:00.000Z",
    "errors": {}
  }
}
```

---

## 🧩 Helper: `createResponse`

```ts
export const createResponse = (
  success: boolean,
  message: string,
  data = {},
  meta = {}
) => ({
  success,
  message,
  data,
  meta: {
    timestamp: new Date().toISOString(),
    ...meta,
  },
});
```

### 📌 Penggunaan di Controller
```ts
import { createResponse } from '../helpers/responseHelper'

export const getExample = async (c: Context) => {
  const data = await someDatabaseQuery()
  return c.json(createResponse(true, 'Data ditemukan', data))
}
```

---

## 🛑 Middleware: `errorHandler`

```ts
import { Context, Next } from 'hono'
import { createResponse } from '../helpers/responseHelper'
import { HttpException } from 'hono/http-exception'

export const errorHandler = async (c: Context, next: Next) => {
  try {
    await next()
  } catch (err: any) {
    console.error('[ERROR]', err)

    const status = err instanceof HttpException ? err.status : 500
    const message = err.message || 'Internal Server Error'
    const errors = err instanceof HttpException ? err.errors : {}

    return c.json(
      createResponse(false, message, {}, { errors }),
      status as any
    )
  }
}
```

### 📌 Registrasi Middleware
```ts
app.use('*', errorHandler)
```

---

## 📁 Struktur Folder yang Direkomendasikan

```
src/
├── controllers/
│   └── authController.ts
├── middlewares/
│   └── errorHandler.ts
├── helpers/
│   └── responseHelper.ts
├── routes/
│   ├── authRoutes.ts
│   ├── userRoutes.ts
│   ├── productRoutes.ts
│   └── index.ts
├── index.ts
```

---

## 💡 Tips

- Gunakan `HttpException` dari `hono/http-exception` jika ingin mengontrol kode status.
- Middleware `errorHandler` akan menangani semua error secara global jika didaftarkan di root `app.use('*')`.
- Gunakan `createResponse` untuk seluruh response API agar konsisten.

---

Happy coding! 🚀

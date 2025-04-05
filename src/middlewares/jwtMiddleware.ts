import { Context, Next } from "hono";
import {verify} from "jsonwebtoken";

export const jwtMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ success: false, message: "Unauthorized" }, 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verify(token, process.env.SECRET_KEY!) as { userId: number };
    c.set("userId", decoded.userId); // Simpan userId untuk endpoint berikutnya
    await next();
  } catch (error) {
    return c.json({ success: false, message: "Invalid or expired token" }, 401);
  }
};
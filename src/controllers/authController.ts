//Import Context
import { Context } from 'hono';

//Import Prism Client
import prisma from '../../prisma/client';

import { hash,compare } from 'bcryptjs';
import { createResponse } from '../helper/responseHelper';
import { sign } from 'jsonwebtoken';

// function for login
export async function login(c: Context) {
  const { email, password } = await c.req.parseBody();

  if (!email || !password) {
    return c.json(createResponse(false, 'Email and password are required'), 400);
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toString() }
  });

  if (!user) {
    return c.json(createResponse(false, 'Email not found'), 404);
  }

  const isValid = await compare(password.toString(), user.password);

  if (!isValid) {
    return c.json(createResponse(false, 'Invalid password'), 401);
  }

  const token = sign({ userId: user.id }, process.env.SECRET_KEY!, {
    expiresIn: "1d"
  });

  return c.json(createResponse(true, 'Login Success', {
    id: user.id,
    email: user.email,
    name: user.name,
    token
  }));
}

export async function register(c: Context) {
  try {
    const { name, email, password } = await c.req.parseBody();

    if (!name || !email || !password) {
      return c.json(createResponse(false, 'Name, email and password are required'), 400);
    }

    const existing = await prisma.user.findUnique({ where: { email: email.toString() } });
    if (existing) {
      return c.json(createResponse(false, 'User already exists'), 409);
    }

    const hashedPassword = await hash(password.toString(), 10);

    const user = await prisma.user.create({
      data: {
        name: name.toString(),
        email: email.toString(),
        password: hashedPassword
      }
    });

    return c.json(createResponse(true, 'Register completed', {
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    }));
  } catch (e) {
    console.error(e);
    return c.json(createResponse(false, 'Something went wrong'), 500);
  }
}

export async function getProfile(c: Context) {
  const userId = c.get('userId'); // pastikan middleware auth set ini

  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    return c.json(createResponse(false, 'User not found'), 404);
  }

  return c.json(createResponse(true, 'User found', {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt
  }));
}
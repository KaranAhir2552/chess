import { ApiError } from '@repo/backend-common/errors';
import { Request, RequestHandler, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { env } from '@repo/backend-common/config';
import jwt from 'jsonwebtoken';
import prisma from '@repo/db/client';
import bcrypt from 'bcryptjs';
export const login: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  // Handle registration logic here (e.g., save user to database)
  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  // find user already exists in database, if so throw error
  // if not, create user in database
  const existingUser = await prisma.default.user.findUnique({ where: { email } });
  // compare password with passwordHash using bcrypt
  if (!existingUser || !(await bcrypt.compare(password, existingUser.passwordHash))) {
    throw new ApiError(400, 'Invalid email or password');
  }
  const token = jwt.sign({ email, id: existingUser.id }, env.JWT_SECRET!, { expiresIn: '7d' });
  res.json({ existingUser, token });
});
export const register: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  // Handle registration logic here (e.g., save user to database)
  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }
  const passwordHash = await bcrypt.hash(password, 10);

  // find user already exists in database, if so throw error
  // if not, create user in database
  const existingUser = await prisma.default.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ApiError(400, 'User already exists');
  }
  const user = await prisma.default.user.create({ data: { email, passwordHash } });

  const token = jwt.sign({ email, id: user.id }, env.JWT_SECRET!, { expiresIn: '7d' });
  res.json({ user, token });
});

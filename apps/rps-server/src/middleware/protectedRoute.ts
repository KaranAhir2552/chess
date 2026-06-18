import jwt, { decode, JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { env } from '@repo/backend-common/config';

export const protectedRouter: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401);
      throw new Error('Unauthorized - No valid Authorization header');
    }

    const token = authHeader.slice(7);

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET as string) as JwtPayload;
      // attach decoded payload
      console.log(decoded);
      req.user = { id: decoded.id };
      next();
    } catch (error) {
      res.status(401);
      throw new Error('Unauthorized - Invalid token');
    }
  }
);

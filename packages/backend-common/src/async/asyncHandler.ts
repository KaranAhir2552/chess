import { Request, Response, NextFunction } from 'express';
// we using lib but this is similar like express-async-handler
// right now we not using this just make it so keep it  ==> done
export const asyncHandler = (req: Request, res: Response, next: NextFunction) => {
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

import bcrypt from 'bcrypt';
import type { NextFunction, Request, Response } from 'express';
import User from '../../models/user.ts';
import { ResponseObj } from '../../src/lib/responseBuilder.ts';

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      ...req.body,
      password: hash,
    });
    try {
      await user.save();
      next();
    } catch (error: any) {
      if (error.code === 11000) {
        res
          .status(400)
          .json(ResponseObj.doResponse(true, 'Email already exists', {}));
      } else {
        res.status(500).json(ResponseObj.doResponse(true, 'Signup Failed', {}));
      }
    }
  } catch {
    res.status(500).json(ResponseObj.doResponse(true, 'Signup failed', {}));
  }
};

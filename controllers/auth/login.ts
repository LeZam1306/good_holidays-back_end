import bcrypt from 'bcrypt';
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../../models/user.ts';
import { ResponseObj } from '../../src/lib/responseBuilder.ts';

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userDBFind = await User.findOne({ email: req.body.email });
    if (userDBFind) {
      try {
        const valid = await bcrypt.compare(
          req.body.password,
          userDBFind.password,
        );

        if (valid) {
          const token = jwt.sign({ userId: userDBFind._id }, 'SECRET', {
            expiresIn: '24h',
          });
          res
            .status(200)
            .cookie('token', token, {
              httpOnly: true,
              secure: false,
              sameSite: 'lax', // Lax works for localhost
              maxAge: 60 * 60 * 24 * 1000,
            })
            .json(
              ResponseObj.doResponse(false, 'Authentification success', {}),
            );
        } else {
          res
            .status(400)
            .json(ResponseObj.doResponse(true, 'Authentification failed', {}));
        }
      } catch {
        res
          .status(400)
          .json(ResponseObj.doResponse(true, 'Authentification failed', {}));
      }
    } else {
      res
        .status(400)
        .json(ResponseObj.doResponse(true, 'Authentification failed', {}));
    }
  } catch {
    res
      .status(400)
      .json(ResponseObj.doResponse(true, 'Authentification failed', {}));
  }
};

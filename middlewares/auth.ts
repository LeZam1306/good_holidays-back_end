import type { NextFunction, Response } from 'express';
import Jwt from 'jsonwebtoken';
import BlackListSession from '../models/blacklistSession.ts';
import { ResponseObj } from '../src/lib/responseBuilder.ts';
import type { AuthRequest } from '../src/types/authRequest.interface.ts';

type DecodedToken = { userId: string; exp: number };

const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(400)
      .json(ResponseObj.doResponse(true, 'User not authentified', {}));
  }
  const exist = await BlackListSession.exists({ token: token });
  if (exist) {
    return res
      .status(400)
      .json(ResponseObj.doResponse(true, 'User not authentified', {}));
  }
  try {
    const decodedToken = Jwt.verify(token, 'SECRET') as DecodedToken;
    req.auth = {
      userId: decodedToken.userId,
      expireAt: new Date(decodedToken.exp * 1000),
      token: token,
    };
    next();
  } catch {
    return res
      .status(400)
      .json(ResponseObj.doResponse(true, 'User not authentified', {}));
  }
};

export default auth;

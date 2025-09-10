import type { NextFunction, Request, Response } from 'express';
import Jwt from 'jsonwebtoken';
import { ResponseObj } from '../src/lib/responseBuilder.ts';

interface AuthRequest extends Request {
  auth?: { userId: string };
}
type DecodedToken = { userId: string };

const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  !token &&
    res
      .status(400)
      .json(ResponseObj.doResponse(true, 'User not authentified', {}));

  try {
    const decodedToken = Jwt.verify(token, 'SECRET') as DecodedToken;
    req.auth = {
      userId: decodedToken.userId,
    };
    next();
  } catch {
    res
      .status(400)
      .json(ResponseObj.doResponse(true, 'User not authentified', {}));
  }
};

export default auth;

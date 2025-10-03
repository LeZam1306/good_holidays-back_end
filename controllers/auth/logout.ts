import type { NextFunction, Response } from 'express';
import type { AuthRequest } from 'src/types/authRequest.interface.ts';
import BlacklistSession from '../../models/blacklistSession.ts';
import { ResponseObj } from '../../src/lib/responseBuilder.ts';

export const logout = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log(req.auth?.userId);
    //const blacklistSession = new BlacklistSession({});
  } catch {
    res.status(500).json(ResponseObj.doResponse(true, '', {}));
  }
};

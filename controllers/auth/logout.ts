import type { NextFunction, Response } from 'express';
import type { AuthRequest } from 'src/types/authRequest.interface.ts';
import BlackListSession from '../../models/blacklistSession.ts';
import { ResponseObj } from '../../src/lib/responseBuilder.ts';

export const logout = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const blacklistSession = new BlackListSession({
      token: req.auth?.token,
      expireAt: req.auth?.expireAt,
    });

    await blacklistSession.save();
    res.status(204).json();
  } catch {
    res.status(500).json(ResponseObj.doResponse(true, '', {}));
  }
};

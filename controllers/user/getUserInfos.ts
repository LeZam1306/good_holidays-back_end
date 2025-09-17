import type { NextFunction, Response } from 'express';
import type { AuthRequest } from 'src/types/authRequest.interface.ts';
import UserInfo from '../../models/userInfo.ts';
import { ResponseObj } from '../../src/lib/responseBuilder.ts';

export const getUserInfos = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.auth?.userId;
  try {
    const userInfo = await UserInfo.findOne({ _id: userId });
    if (userInfo) {
      res
        .status(200)
        .json(ResponseObj.doResponse(false, 'User info find', userInfo));
    } else
      res
        .status(400)
        .json(ResponseObj.doResponse(true, 'User infos not found', {}));
  } catch {
    res
      .status(400)
      .json(ResponseObj.doResponse(true, 'User infos not found', {}));
  }
};

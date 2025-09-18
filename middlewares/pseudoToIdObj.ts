import type { NextFunction, Response } from 'express';
import UserInfo from '../models/userInfo.ts';
import { ResponseObj } from '../src/lib/responseBuilder.ts';
import type { AuthRequest } from '../src/types/authRequest.interface.ts';

export const pseudoToIdObj = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const pseudo = req.body.pseudo;
    const userIdObj = await UserInfo.findOne({ pseudo: pseudo }).select('_id');
    if (!userIdObj) {
      return res
        .status(404)
        .json(ResponseObj.doResponse(true, 'No user found', {}));
    }
    req.body.invitedId = userIdObj._id;
    next();
  } catch {
    return res
      .status(500)
      .json(ResponseObj.doResponse(true, 'Server error', {}));
  }
};

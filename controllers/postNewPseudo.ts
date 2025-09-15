import type { NextFunction, Response } from 'express';
import UserInfo from '../models/userInfo.ts';
import { ResponseObj } from '../src/lib/responseBuilder.ts';
import type { AuthRequest } from '../src/types/authRequest.interface.ts';

export const postNewPseudo = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.auth?.userId;
  try {
    const result = await UserInfo.updateOne(
      { _id: userId },
      { $set: { pseudo: req.body.pseudo } },
    );
    res
      .status(200)
      .json(ResponseObj.doResponse(false, 'Pseudo changed success', {}));
  } catch (err: any) {
    if (err.code === 11000) {
      res
        .status(400)
        .json(ResponseObj.doResponse(true, 'This nickname already exists', {}));
    } else {
      res
        .status(400)
        .json(ResponseObj.doResponse(true, 'Failed to change pseudo', {}));
    }
  }
};

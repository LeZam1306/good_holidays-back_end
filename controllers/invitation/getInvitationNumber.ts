import type { NextFunction, Response } from 'express';
import { Types } from 'mongoose';
import type { AuthRequest } from 'src/types/authRequest.interface.ts';
import Invitation from '../../models/invitation.ts';
import { ResponseObj } from '../../src/lib/responseBuilder.ts';

export const getInvitationNumber = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const userIdObj = new Types.ObjectId(req.auth?.userId);
  try {
    const count = await Invitation.countDocuments({
      invitedId: userIdObj,
      status: 'PENDING',
    });

    return res
      .status(200)
      .json(ResponseObj.doResponse(false, '', { invitationNumber: count }));
  } catch {
    res.status(500).json(ResponseObj.doResponse(true, 'Server error', {}));
  }
};

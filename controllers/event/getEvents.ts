import type { NextFunction, Response } from 'express';
import { Types } from 'mongoose';
import type { AuthRequest } from 'src/types/authRequest.interface';
import Event from '../../models/event.ts';
import { ResponseObj } from '../../src/lib/responseBuilder.ts';

export const getEvents = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const userIdObj = new Types.ObjectId(req.auth?.userId);
  console.log(userIdObj);
  try {
    const events = await Event.find({ participants: [userIdObj] }).select(
      '-participants',
    );
    if (events) {
      res
        .status(200)
        .json(
          ResponseObj.doResponse(false, 'Events found', { events: events }),
        );
    } else {
      res
        .status(400)
        .json(ResponseObj.doResponse(true, 'No event(s) found', {}));
    }
  } catch {
    res.status(500).json(ResponseObj.doResponse(true, 'Server error', {}));
  }
};

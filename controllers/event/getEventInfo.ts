import type { NextFunction, Response } from 'express';
import { Types } from 'mongoose';
import type { AuthRequest } from 'src/types/authRequest.interface.ts';
import Event from '../../models/event.ts';
import EventInfo from '../../models/eventInfo.ts';
import UserInfo from '../../models/userInfo.ts';
import { ResponseObj } from '../../src/lib/responseBuilder.ts';

export const getEventInfo = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const { idEvent } = req.params;
  const userIdObj = new Types.ObjectId(req.auth?.userId);

  try {
    // Check if idEvent is provided
    if (!idEvent) {
      return res
        .status(400)
        .json(ResponseObj.doResponse(true, 'Event ID is required', {}));
    }

    // Validate if idEvent is a valid ObjectId
    if (!Types.ObjectId.isValid(idEvent)) {
      return res
        .status(400)
        .json(ResponseObj.doResponse(true, 'Invalid event ID', {}));
    }

    const eventIdObj = new Types.ObjectId(idEvent);

    // Check if the event exists and if the user is a participant
    const event = await Event.findOne({
      _id: eventIdObj,
      participants: userIdObj,
    });

    if (!event) {
      return res
        .status(404)
        .json(
          ResponseObj.doResponse(
            true,
            'Event not found or user is not a participant',
            {},
          ),
        );
    }
    // Get participant pseudo
    const idParticipants = event.participants;

    const participantsObj = await UserInfo.find({
      _id: { $in: idParticipants },
    }).select('pseudo -_id');
    const participants = participantsObj.map(
      (participant) => participant.pseudo,
    );

    // Get the eventInfo for this event
    const eventInfo = await EventInfo.findById(eventIdObj).lean();

    if (!eventInfo) {
      return res
        .status(404)
        .json(ResponseObj.doResponse(true, 'Event info not found', {}));
    }

    res.status(200).json(
      ResponseObj.doResponse(false, 'Event info found', {
        ...eventInfo,
        participants: participants,
      }),
    );
  } catch (error) {
    res.status(500).json(ResponseObj.doResponse(true, 'Server error', {}));
  }
};

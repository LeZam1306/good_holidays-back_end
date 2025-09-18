import type { NextFunction, Response } from 'express';
import { Types } from 'mongoose';
import type { AuthRequest } from 'src/types/authRequest.interface.ts';
import Event from '../../models/event.ts';
import Invitation from '../../models/invitation.ts';
import { ResponseObj } from '../../src/lib/responseBuilder.ts';
import type { InvitationStatus } from '../../src/types/invitationStatus.type.ts';

export const postInvitation = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  //verifier l'authentification !!!!
  try {
    if (
      !Types.ObjectId.isValid(req.body.invitedId) ||
      !Types.ObjectId.isValid(req.body.eventId as string) ||
      !Types.ObjectId.isValid(req.auth?.userId as string)
    ) {
      return res.status(400).json(ResponseObj.doResponse(true, '', {}));
    }
    const invitedId = new Types.ObjectId(req.body.invitedId as string);
    const eventId = new Types.ObjectId(req.body.eventId as string);
    const userId = new Types.ObjectId(req.auth?.userId);

    //Verify permission
    const checkUser = await Event.exists({
      _id: eventId,
      promotor: userId,
    });

    if (!checkUser) {
      return res
        .status(403)
        .json(
          ResponseObj.doResponse(
            true,
            'You do not have permission to send the invitation',
            {},
          ),
        );
    }

    const creationDate = new Date();
    const status: InvitationStatus = 'PENDING';

    //Verify if the invitation is already sent
    const verifyExistenceInvitation = await Invitation.findOne({
      eventId: eventId,
      invitedId: invitedId,
    });

    if (verifyExistenceInvitation) {
      return res
        .status(400)
        .json(ResponseObj.doResponse(true, 'invitation already sent', {}));
    }

    const invitation = new Invitation({
      eventId: eventId,
      invitedId: invitedId,
      creationDate: creationDate,
      status: status,
    });

    try {
      await invitation.save();
      return res
        .status(201)
        .json(ResponseObj.doResponse(false, 'Invitation sended', {}));
    } catch {
      return res
        .status(400)
        .json(ResponseObj.doResponse(false, 'Fail to send Invitation', {}));
    }
  } catch {
    return res
      .status(500)
      .json(ResponseObj.doResponse(true, 'Server error', {}));
  }
};

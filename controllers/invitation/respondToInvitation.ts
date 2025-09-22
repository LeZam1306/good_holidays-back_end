import type { NextFunction, Response } from 'express';
import { Types } from 'mongoose';
import type { AuthRequest } from 'src/types/authRequest.interface.ts';
import Event from '../../models/event.ts';
import Invitation from '../../models/invitation.ts';
import { ResponseObj } from '../../src/lib/responseBuilder.ts';
import type { InvitationStatus } from '../../src/types/invitationStatus.type.ts';

export const respondToInvitation = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Parameters validation
    if (
      !Types.ObjectId.isValid(req.body.eventId as string) ||
      !Types.ObjectId.isValid(req.auth?.userId as string)
    ) {
      return res
        .status(400)
        .json(ResponseObj.doResponse(true, 'Invalid IDs', {}));
    }

    const eventId = new Types.ObjectId(req.body.eventId as string);
    const userId = new Types.ObjectId(req.auth?.userId);
    const response = req.body.response as string;

    // Response validation
    if (response !== 'ACCEPTED' && response !== 'REFUSED') {
      return res
        .status(400)
        .json(
          ResponseObj.doResponse(
            true,
            'Response must be ACCEPTED or REFUSED',
            {},
          ),
        );
    }

    // Verify that the invitation exists and belongs to the user
    const invitation = await Invitation.findOne({
      eventId: eventId,
      invitedId: userId,
      status: 'PENDING',
    });

    if (!invitation) {
      return res
        .status(404)
        .json(
          ResponseObj.doResponse(
            true,
            'Invitation not found or already processed',
            {},
          ),
        );
    }

    if (response === 'ACCEPTED') {
      // Add the user to the event participants
      await Event.findByIdAndUpdate(eventId, {
        $addToSet: { participants: userId },
      });

      return res
        .status(200)
        .json(
          ResponseObj.doResponse(false, 'Invitation accepted successfully', {}),
        );
    } else {
      // Change the invitation status to REFUSED
      await Invitation.findByIdAndUpdate(invitation._id, {
        status: 'REFUSED' as InvitationStatus,
      });

      return res
        .status(200)
        .json(
          ResponseObj.doResponse(false, 'Invitation refused successfully', {}),
        );
    }
  } catch (error) {
    console.error('Error responding to invitation:', error);
    return res
      .status(500)
      .json(ResponseObj.doResponse(true, 'Internal server error', {}));
  }
};

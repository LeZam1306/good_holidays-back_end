import type { NextFunction, Response } from 'express';
import { Types } from 'mongoose';
import type { AuthRequest } from 'src/types/authRequest.interface.ts';
import Invitation from '../../models/invitation.ts';
import { ResponseObj } from '../../src/lib/responseBuilder.ts';

export const getPendingInvitations = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const userIdObj = new Types.ObjectId(req.auth?.userId);

  try {
    // Single optimized query using aggregation pipeline
    const eventsWithInvitations = await Invitation.aggregate([
      // Match pending invitations for the authenticated user
      {
        $match: {
          invitedId: userIdObj,
          status: 'PENDING',
        },
      },
      // Join with Event collection - only select needed fields
      {
        $lookup: {
          from: 'events',
          localField: 'eventId',
          foreignField: '_id',
          as: 'event',
          pipeline: [
            {
              $project: {
                eventName: 1,
                date: 1,
                promotor: 1,
              },
            },
          ],
        },
      },
      // Join with EventInfo collection - only select needed fields
      {
        $lookup: {
          from: 'eventInfos',
          localField: 'eventId',
          foreignField: '_id',
          as: 'eventInfo',
          pipeline: [
            {
              $project: {
                description: 1,
                location: 1,
              },
            },
          ],
        },
      },
      // Reshape the output to match the expected format
      {
        $project: {
          invitationId: '$_id',
          event: {
            id: '$eventId',
            eventName: { $arrayElemAt: ['$event.eventName', 0] },
            date: { $arrayElemAt: ['$event.date', 0] },
            promotor: { $arrayElemAt: ['$event.promotor', 0] },
            description: {
              $ifNull: [{ $arrayElemAt: ['$eventInfo.description', 0] }, null],
            },
            location: {
              $ifNull: [{ $arrayElemAt: ['$eventInfo.location', 0] }, null],
            },
          },
        },
      },
    ]);

    return res.status(200).json(
      ResponseObj.doResponse(
        false,
        'Pending invitations retrieved successfully',
        {
          invitations: eventsWithInvitations,
        },
      ),
    );
  } catch (error) {
    console.error('Error fetching pending invitations:', error);
    res.status(500).json(ResponseObj.doResponse(true, 'Server error', {}));
  }
};

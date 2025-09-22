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
                promotor: { $arrayElemAt: ['$promotor', 0] }, // Only first element
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
      // Unwind the event array to get a single object
      {
        $unwind: {
          path: '$event',
          preserveNullAndEmptyArrays: true,
        },
      },
      // Unwind the eventInfo array to get a single object
      {
        $unwind: {
          path: '$eventInfo',
          preserveNullAndEmptyArrays: true,
        },
      },
      // Reshape the output to match the expected format
      {
        $project: {
          event: {
            _id: { $toString: '$eventId' }, // Convert ObjectId to string and use _id instead of id
            eventName: '$event.eventName',
            date: '$event.date',
            promotor: '$event.promotor',
            description: {
              $ifNull: ['$eventInfo.description', ''],
            },
            location: {
              $ifNull: ['$eventInfo.location', ''],
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

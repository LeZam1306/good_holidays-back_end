import type { NextFunction, Response } from 'express';
import { Types } from 'mongoose';
import type { AuthRequest } from 'src/types/authRequest.interface.ts';
import Event from '../../models/event.ts';
import EventInfo from '../../models/eventInfo.ts';
import UserInfo from '../../models/userInfo.ts';
import { ResponseObj } from '../../src/lib/responseBuilder.ts';

export const patchEvent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const { eventId } = req.params;
  const { description, location } = req.body;
  const userId = req.auth?.userId;

  try {
    // Check if user is authenticated
    if (!userId) {
      return res
        .status(401)
        .json(ResponseObj.doResponse(true, 'User not authenticated', {}));
    }

    // Check if eventId is provided
    if (!eventId) {
      return res
        .status(400)
        .json(ResponseObj.doResponse(true, 'Event ID is required', {}));
    }

    // Validate if eventId is a valid ObjectId
    if (!Types.ObjectId.isValid(eventId)) {
      return res
        .status(400)
        .json(ResponseObj.doResponse(true, 'Invalid event ID', {}));
    }

    const eventIdObj = new Types.ObjectId(eventId);

    // Check if the event exists
    const event = await Event.findById(eventIdObj);
    if (!event) {
      return res
        .status(404)
        .json(ResponseObj.doResponse(true, 'Event not found', {}));
    }

    // Get user pseudo to check if user is promotor
    const userInfo = await UserInfo.findById(userId);
    if (!userInfo) {
      return res
        .status(404)
        .json(ResponseObj.doResponse(true, 'User information not found', {}));
    }

    // Check if user is promotor of the event
    if (
      !event.promotor ||
      !Array.isArray(event.promotor) ||
      !event.promotor.includes(userInfo.pseudo)
    ) {
      return res
        .status(403)
        .json(
          ResponseObj.doResponse(
            true,
            'Access denied: Only event promotors can modify the event',
            {},
          ),
        );
    }

    // Validate that at least one field is provided for update
    if (!description && !location) {
      return res
        .status(400)
        .json(
          ResponseObj.doResponse(
            true,
            'At least one field (description or location) must be provided',
            {},
          ),
        );
    }

    // Prepare update object for EventInfo
    const updateFields: { description?: string; location?: string } = {};
    if (description !== undefined) {
      updateFields.description = description;
    }
    if (location !== undefined) {
      updateFields.location = location;
    }

    // Update EventInfo with new description and/or location
    const updatedEventInfo = await EventInfo.findByIdAndUpdate(
      eventIdObj,
      updateFields,
      { new: true, runValidators: true },
    );

    if (!updatedEventInfo) {
      return res
        .status(404)
        .json(ResponseObj.doResponse(true, 'Event information not found', {}));
    }

    return res
      .status(200)
      .json(
        ResponseObj.doResponse(
          false,
          'Event updated successfully',
          updatedEventInfo,
        ),
      );
  } catch (error) {
    console.error('Error updating event:', error);
    return res
      .status(500)
      .json(ResponseObj.doResponse(true, 'Internal server error', {}));
  }
};

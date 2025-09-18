import type { NextFunction, Response } from 'express';
import type { AuthRequest } from 'src/types/authRequest.interface.ts';
import Event from '../../models/event.ts';
import EventInfo from '../../models/eventInfo.ts';
import UserInfo from '../../models/userInfo.ts';
import { ResponseObj } from '../../src/lib/responseBuilder.ts';

export const postEvent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Get user ID from req.auth
    const userId = req.auth?.userId;
    if (!userId) {
      return res
        .status(401)
        .json(ResponseObj.doResponse(true, 'User not authenticated', {}));
    }

    // Get data from request body
    const { eventName, description, location, maxParticipant, eventDate } =
      req.body;

    // Validate required fields
    if (!eventName || !location || !eventDate) {
      return res
        .status(400)
        .json(
          ResponseObj.doResponse(
            true,
            'Required fields missing: eventName, location, eventDate',
            {},
          ),
        );
    }

    // Get user pseudo
    const userInfo = await UserInfo.findById(userId);
    if (!userInfo) {
      return res
        .status(404)
        .json(ResponseObj.doResponse(true, 'User information not found', {}));
    }

    // Create Event
    const newEvent = new Event({
      eventName,
      date: new Date(eventDate),
      status: 'soon',
      promotor: [userInfo.pseudo, userInfo._id],
      participants: [userId], // Array containing only the creator's ID
    });

    const savedEvent = await newEvent.save();

    try {
      // Create EventInfo with Event ID
      const newEventInfo = new EventInfo({
        _id: savedEvent._id,
        creationDate: new Date(), // Today's date
        description: description || '',
        maxParticipant: maxParticipant || null,
        location,
      });

      await newEventInfo.save();

      // Success - return data
      return res
        .status(201)
        .json(ResponseObj.doResponse(false, 'Event created successfully', {}));
    } catch (eventInfoError) {
      // If EventInfo fails, delete the created Event
      await Event.findByIdAndDelete(savedEvent._id);
      console.error('Error creating EventInfo:', eventInfoError);
      return res
        .status(500)
        .json(ResponseObj.doResponse(true, 'Error creating event details', {}));
    }
  } catch (eventError) {
    console.error('Error creating Event:', eventError);
    return res
      .status(500)
      .json(ResponseObj.doResponse(true, 'Error creating event', {}));
  }
};

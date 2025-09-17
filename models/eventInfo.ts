import mongoose, { Types } from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    _id: { type: Types.ObjectId, ref: 'Event', required: true },
    creationDate: { type: Date, required: true },
    description: { type: String, required: false },
    maxParticipant: { type: Number, required: false },
    location: { type: String, required: true },
  },
  { collection: 'eventInfos' },
);

export default mongoose.model('EventInfo', eventSchema);

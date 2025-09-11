import mongoose, { Types } from 'mongoose';

const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, required: true },
  promotor: { type: String, required: true },
  participants: [{ type: Types.ObjectId, ref: 'UserInfo', required: false }],
});

export default mongoose.model('Event', eventSchema);

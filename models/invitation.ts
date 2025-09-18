import mongoose, { Types } from 'mongoose';

const invitation = new mongoose.Schema({
  eventId: { type: Types.ObjectId, required: true },
  invitedId: { type: Types.ObjectId, required: true },
  creationDate: { type: Date, required: true },
  status: { type: String, required: true },
});

export default mongoose.model('Invitation', invitation);

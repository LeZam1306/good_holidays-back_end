import mongoose, { Types } from 'mongoose';

const userInfoSchema = new mongoose.Schema(
  {
    _id: { type: Types.ObjectId, ref: 'User', required: true },
    pseudo: { type: String, required: true, unique: true },
    creationDate: { type: Date, required: true },
    verified: { type: Boolean, required: true },
  },
  { collection: 'userInfos' },
);

export default mongoose.model('UserInfo', userInfoSchema);

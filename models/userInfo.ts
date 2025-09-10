import mongoose from 'mongoose';

const userInfoSchema = new mongoose.Schema(
  {
    _id: { type: String, require: true },
    pseudo: { type: String, required: true, unique: true },
    creationDate: { type: Date, required: true },
  },
  { collection: 'userInfos' },
);

export default mongoose.model('UserInfo', userInfoSchema);

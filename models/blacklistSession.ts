import mongoose from 'mongoose';

const blacklistSessionSchema = new mongoose.Schema(
  {
    token: { type: String, require: true },
    expireAt: { type: Date, require: true },
  },
  { collection: 'BlackListSession' },
);

blacklistSessionSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('BlackListSession', blacklistSessionSchema);

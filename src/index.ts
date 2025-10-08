import cookieParser from 'cookie-parser';
import cors from 'cors';
import type { Application } from 'express';
import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import mongoose from 'mongoose';
// @
import xss from 'xss-clean';
import authRoutes from '../routes/auth.ts';
import eventRoutes from '../routes/event.ts';
import invitationRoutes from '../routes/invitation.ts';
import userRoutes from '../routes/user.ts';

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/goodholidays');
    console.log('Connection to goodholidays DB successful');
  } catch {
    console.log('Connection failed');
  }
};

connectDB();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(xss());
app.use(mongoSanitize());
app.use(
  helmet({
    strictTransportSecurity: false,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/event', eventRoutes);
app.use('/api/invitation', invitationRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

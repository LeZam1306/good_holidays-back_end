import cookieParser from 'cookie-parser';
import cors from 'cors';
import type { Application } from 'express';
import express from 'express';
import mongoose from 'mongoose';
import authRoutes from '../routes/auth.ts';
import userRoutes from '../routes/user.ts';

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/goodholidays');
    console.log('Connexion à goodholidays DB réussi');
  } catch {
    console.log('Connexion à échoué');
  }
};

connectDB();

const app: Application = express();
const PORT = process.env.PORT || 3000;

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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

import cors from 'cors';
import type { Application } from 'express';
import express from 'express';
import mongoose from 'mongoose';
import authRoutes from '../routes/auth.ts';

mongoose
  .connect('mongodb://127.0.0.1:27017/goodholidays')
  .then(() => console.log('Connexion à goodholidays DB réussi'))
  .catch(() => console.log('Connexion à échoué'));

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

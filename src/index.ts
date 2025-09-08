import type { Application, Request, Response } from 'express';
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

app.use((req: Request, res: Response, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization',
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  );
  next();
});

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

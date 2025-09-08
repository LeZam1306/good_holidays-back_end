import type { Application, Request, Response } from 'express';
import express from 'express';
import mongoose from 'mongoose';

mongoose
  .connect('mongodb://127.0.0.1:27017/goodholidays')
  .then(() => console.log('Connexion à goodhilaysDB réussi'))
  .catch(() => console.log('Connexion à échoué'));

const app: Application = express();
const PORT = process.env.PORT || 3000;

interface ResponseAPI {
  error: Boolean;
  message: string;
  data: Object;
}

class ResponseObj {
  private error: Boolean;
  private message: string;
  private data: Object;

  constructor(error: boolean, message: string, data: object) {
    this.error = error;
    this.message = message;
    this.data = data;
  }

  doResponse(): ResponseAPI {
    const res: ResponseAPI = {
      error: this.error,
      message: this.message,
      data: this.data,
    };
    return res;
  }
}

app.use(express.json());

app.use((requ: Request, res: Response, next) => {
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

app.post('/api/login', (req: Request, res: Response, next) => {});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

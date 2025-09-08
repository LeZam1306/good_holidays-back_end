import type { Application, Request, Response } from 'express';
import express from 'express';
import mongoose from 'mongoose';
import User from '../models/user.ts';

mongoose
  .connect('mongodb://127.0.0.1:27017/goodholidays')
  .then(() => console.log('Connexion à goodholidays DB réussi'))
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

  static doResponse(
    error: Boolean,
    message: string,
    data: Object,
  ): ResponseAPI {
    const res: ResponseAPI = {
      error: error,
      message: message,
      data: data,
    };
    return res;
  }
}

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

app.post('/api/signup', (req: Request, res: Response, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user === null) {
        const user = new User({
          ...req.body,
          date: '2025-09-08',
        });
        user
          .save()
          .then(() =>
            res
              .status(201)
              .json(ResponseObj.doResponse(false, 'Signup success', user)),
          )
          .catch(() =>
            res
              .status(400)
              .json(ResponseObj.doResponse(true, 'Signup Failed', {})),
          );
      } else
        res
          .status(400)
          .json(ResponseObj.doResponse(true, 'Signup Failed !', {}));
    })
    .catch(() =>
      res.status(400).json(ResponseObj.doResponse(true, 'Signup Failed !', {})),
    );
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

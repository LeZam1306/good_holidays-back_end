import bcrypt from 'bcrypt';
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.ts';
import { ResponseObj } from '../src/lib/responseBuilder.ts';

export const signup = (req: Request, res: Response, next: NextFunction) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        ...req.body,
        password: hash,
      });
      user
        .save()
        .then(() =>
          res
            .status(201)
            .json(ResponseObj.doResponse(false, 'Signup success', user)),
        )
        .catch((error) => {
          if (error.code === 11000) {
            res
              .status(400)
              .json(ResponseObj.doResponse(true, 'Email already exists', {}));
          } else {
            res
              .status(500)
              .json(ResponseObj.doResponse(true, 'Signup Failed', {}));
          }
        });
    })
    .catch(() =>
      res.status(500).json(ResponseObj.doResponse(true, 'Signup failed', {})),
    );
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  User.findOne({ email: req.body.email })
    .then((userDBFind) => {
      if (userDBFind) {
        bcrypt
          .compare(req.body.password, userDBFind.password)
          .then((valid) => {
            if (valid) {
              const token = jwt.sign({ userId: userDBFind._id }, 'SECRET', {
                expiresIn: '24h',
              });
              res
                .status(200)
                .cookie('token', token, {
                  httpOnly: true,
                  secure: false,
                  sameSite: 'lax',
                  maxAge: 60 * 60 * 24 * 1000,
                })
                .json(
                  ResponseObj.doResponse(false, 'Authentification success', {
                    email: userDBFind.email,
                    id: userDBFind._id,
                  }),
                );
            } else
              res
                .status(400)
                .json(
                  ResponseObj.doResponse(true, 'Authentification failed', {}),
                );
          })
          .catch(() =>
            res
              .status(400)
              .json(
                ResponseObj.doResponse(true, 'Authentification failed', {}),
              ),
          );
      }
    })
    .catch(() =>
      res
        .status(400)
        .json(ResponseObj.doResponse(true, 'Authentification failed', {})),
    );
};

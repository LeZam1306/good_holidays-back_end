import type { NextFunction, Request, Response } from 'express';
import User from '../models/user.ts';
import UserInfo from '../models/userInfo.ts';
import { ResponseObj } from '../src/lib/responseBuilder.ts';

const addUserInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userDBFind = await User.findOne({ email: req.body.email });

    if (userDBFind) {
      const userId = userDBFind._id;
      const date = new Date();
      const pseudo = `guess_${date.getTime()}${Math.floor(Math.random() * (999999 - 0)) + 0}`;

      const userInfo = new UserInfo({
        _id: userId,
        pseudo: pseudo,
        creationDate: date,
        verified: false,
      });

      try {
        await userInfo.save();
        res
          .status(201)
          .json(ResponseObj.doResponse(false, 'New user registered', {}));
      } catch {
        await userDBFind.deleteOne();
        res.status(400).json(ResponseObj.doResponse(true, 'Signup Failed', {}));
      }
    } else {
      res.status(400).json(ResponseObj.doResponse(true, 'Signup Failed', {}));
    }
  } catch {
    res.status(400).json(ResponseObj.doResponse(true, 'Signup Failed', {}));
  }
};

export default addUserInfo;

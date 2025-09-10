import express from 'express';
import { login, signup } from '../controllers/auth.ts';
import addUserInfo from '../middlewares/addUserInfos.ts';

const router = express.Router();

router.post('/signup', signup, addUserInfo);
router.post('/login', login);

export default router;

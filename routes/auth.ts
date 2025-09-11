import express from 'express';
import { login } from '../controllers/auth/login.ts';
import { signup } from '../controllers/auth/signup.ts';
import addUserInfo from '../middlewares/addUserInfos.ts';

const router = express.Router();

router.post('/signup', signup, addUserInfo);
router.post('/login', login);

export default router;

import express from 'express';
import { login } from '../controllers/auth/login.ts';
import { logout } from '../controllers/auth/logout.ts';
import { signup } from '../controllers/auth/signup.ts';
import addUserInfo from '../middlewares/addUserInfos.ts';
import auth from '../middlewares/auth.ts';

const router = express.Router();

router.post('/signup', signup, addUserInfo);
router.post('/login', login);
router.post('/logout', auth, logout);

export default router;

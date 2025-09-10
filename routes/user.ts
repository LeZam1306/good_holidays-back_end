import express from 'express';
import { getUserInfos } from '../controllers/userInfos.ts';
import auth from '../middlewares/auth.ts';

const router = express.Router();

router.get('/', auth, getUserInfos);

export default router;

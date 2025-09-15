import express from 'express';
import { getUserInfos } from '../controllers/getUserInfos.ts';
import { postNewPseudo } from '../controllers/postNewPseudo.ts';
import auth from '../middlewares/auth.ts';

const router = express.Router();

router.get('/', auth, getUserInfos);
router.patch('/', auth, postNewPseudo);

export default router;

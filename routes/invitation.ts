import express from 'express';
import { getNumberInvitation } from '../controllers/invitation/getNumberInvitation.ts';
import { postInvitation } from '../controllers/invitation/postInvitation.ts';
import auth from '../middlewares/auth.ts';
import { pseudoToIdObj } from '../middlewares/pseudoToIdObj.ts';

const router = express.Router();

router.post('/', auth, pseudoToIdObj, postInvitation); //{eventId: string, pseudo: string}
router.get('/count', auth, getNumberInvitation);

export default router;

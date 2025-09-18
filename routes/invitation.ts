import express from 'express';
import { postInvitation } from '../controllers/invitation/postInvitation.ts';
import auth from '../middlewares/auth.ts';
import { pseudoToIdObj } from '../middlewares/pseudoToIdObj.ts';

const router = express.Router();

router.post('/', auth, pseudoToIdObj, postInvitation); //{eventId: string, pseudo: string}

export default router;

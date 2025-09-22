import express from 'express';
import { getInvitationNumber } from '../controllers/invitation/getInvitationNumber.ts';
import { getPendingInvitations } from '../controllers/invitation/getPendingInvitations.ts';
import { postInvitation } from '../controllers/invitation/postInvitation.ts';
import auth from '../middlewares/auth.ts';
import { pseudoToIdObj } from '../middlewares/pseudoToIdObj.ts';

const router = express.Router();

router.post('/', auth, pseudoToIdObj, postInvitation); //{eventId: string, pseudo: string}
router.get('/count', auth, getInvitationNumber);
router.get('/pending', auth, getPendingInvitations);

export default router;

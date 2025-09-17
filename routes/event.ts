import express from 'express';
import { getEventInfo } from '../controllers/event/getEventInfo.ts';
import { getEvents } from '../controllers/event/getEvents.ts';
import { postEvent } from '../controllers/event/postEvent.ts';
import auth from '../middlewares/auth.ts';

const router = express.Router();

router.get('/', auth, getEvents);
router.get('/:idEvent', auth, getEventInfo);
router.post('/', auth, postEvent);

export default router;

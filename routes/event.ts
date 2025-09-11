import express from 'express';
import { getEvents } from '../controllers/event/getEvents.ts';
import auth from '../middlewares/auth.ts';

const router = express.Router();

router.get('/', auth, getEvents);

export default router;

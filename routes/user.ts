import express from 'express';
import auth from '../middlewares/auth.ts';

const router = express.Router();

router.get(':id', auth);

export default router;

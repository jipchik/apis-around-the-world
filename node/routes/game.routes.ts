import express from 'express';
const router = express.Router();

import { addGame } from '../controllers/game.controller';

router.post('/set/:id', addGame);

export default router;

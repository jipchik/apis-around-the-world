import express from 'express';
const router = express.Router();

import { create, findOne } from '../controllers/team.controller';

router.post('/', create);
router.get('/:id', findOne);

export default router;

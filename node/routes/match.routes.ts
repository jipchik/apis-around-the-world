import express from 'express';
const router = express.Router();

import { initialize } from "../controllers/match.controller";

router.post("/", initialize);

export default router;
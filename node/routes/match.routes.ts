import express from 'express';
const router = express.Router();

import { finalize, initialize } from "../controllers/match.controller";

router.post("/", initialize);
router.patch("/:id", finalize)

export default router;
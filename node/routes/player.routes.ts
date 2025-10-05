import express from 'express';
const router = express.Router();

//player controller
import { create, findOneByQuery } from "../controllers/player.controller";

router.post("/", create);
router.get("/", findOneByQuery);

export default router;
import express from 'express';
const router = express.Router();

//player controller
import { create, findOneByQuery, findMatchesForPlayer } from "../controllers/player.controller";

router.post("/", create);
router.get("/", findOneByQuery);
router.get("/:id/matches", findMatchesForPlayer);

export default router;
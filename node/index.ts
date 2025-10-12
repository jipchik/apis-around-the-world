import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import constants from './constants';

dotenv.config();

import gameRoutes from "./routes/game.routes";
import matchRoutes from "./routes/match.routes";
import playerRoutes from "./routes/player.routes";
import teamRoutes  from "./routes/team.routes";

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(`/api/${constants.apiVersion}/games`, gameRoutes);
app.use(`/api/${constants.apiVersion}/matches`, matchRoutes);
app.use(`/api/${constants.apiVersion}/players`, playerRoutes);
app.use(`/api/${constants.apiVersion}/teams`, teamRoutes);

app.listen(port, () => {
  console.log(`🚀 Server started at http://localhost:${port}`);
});

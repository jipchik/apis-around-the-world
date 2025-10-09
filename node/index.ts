import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

import gameRoutes from "./routes/game.routes";
import matchRoutes from "./routes/match.routes";
import playerRoutes from "./routes/player.routes";
// import setRoutes from "./routes/set.routes";

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse application/json
app.use(bodyParser.urlencoded({ extended: true })); // Parse application/x-www-form-urlencoded

app.use("/api/v1/games", gameRoutes);
app.use("/api/v1/matches", matchRoutes);
app.use("/api/v1/players", playerRoutes);
// app.use("/api/v1/sets", setRoutes);

app.listen(port, () => {
  console.log(`🚀 Server started at http://localhost:${port}`);
});

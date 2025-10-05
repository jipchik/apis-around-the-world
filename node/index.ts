import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Import routes
import userRoutes from "./routes/player.routes";

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse application/json
app.use(bodyParser.urlencoded({ extended: true })); // Parse application/x-www-form-urlencoded

app.use("/api/v1/players", userRoutes);

app.listen(port, () => {
  console.log(`🚀 Server started at http://localhost:${port}`);
});

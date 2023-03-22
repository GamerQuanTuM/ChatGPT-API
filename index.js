import express from "express";
import { Configuration, OpenAIApi } from "openai";
import * as dotenv from "dotenv";
import { createServer } from "http";
import dbConnect from "./connect.js";
import modelRouter from "./route.js";
import cors from "cors";

dotenv.config();
const API_KEY = process.env.API_KEY;
const PORT_NO = process.env.PORT;

if (!PORT_NO || !API_KEY || dbConnect()) {
  process.exit(1);
}

const PORT = parseInt(PORT_NO) || 5000;
const app = express();
const server = createServer(app);

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});
export const openai = new OpenAIApi(configuration);

app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
    allowedHeaders: true,
  })
);
app.use("/chatgpt", modelRouter);

server.listen(PORT, () => {
  dbConnect();
  console.log(`Server is running at http://localhost:${PORT}`);
});

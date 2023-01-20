import express from "express";
import { sendMessage } from "./index.js";

const messageRouter = express.Router();

messageRouter.post("/", sendMessage);

export default messageRouter;
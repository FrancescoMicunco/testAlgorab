import express from "express";
import { getMessagesById, sendMessage } from "./index.js";

const messageRouter = express.Router();

messageRouter.post("/", sendMessage);

messageRouter.get("/:id", getMessagesById);

export default messageRouter;
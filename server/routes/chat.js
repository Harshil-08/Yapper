import express from "express";
import { getMyChat, newGroupChat, getChatMembers } from "../controllers/chat.js";

const router = express.Router();

router.post("/create-group", newGroupChat);
router.get("/user-chats", getMyChat);
router.get("/:chatId/members", getChatMembers);

export default router;

import express from "express";
import { 
	getMyChat, 
	newGroupChat, 
	getChatMembers, 
	addMembers, 
	removeMembers, 
} from "../controllers/chat.js";

const router = express.Router();

router.post("/create-group", newGroupChat);
router.get("/user-chats", getMyChat);
router.get("/:chatId/members", getChatMembers);
router.put("/:chatId/add-members", addMembers);
router.put("/:chatId/remove-members", removeMembers);

export default router;

import express from "express";
import { 
	getMyChat, 
	newGroupChat, 
	getChatMembers, 
	addMembers, 
	removeMembers,
	leaveGroup,
	attachments,
	getChatDetails,
	renameGroup,
	deleteChat,
	getMessage,
	joinGroupChat,
} from "../controllers/chat.js";
import { attachmentsMulter } from "../middlewares/multer.js";

const router = express.Router();

router.post("/create-group", newGroupChat);
router.post("/join/:joinLink", joinGroupChat)
router.get("/user-chats", getMyChat);
router.get("/:chatId/members", getChatMembers);
router.put("/add-members", addMembers);
router.put("/remove-members", removeMembers);
router.delete("/leave/:chatId", leaveGroup);
router.post("/attachments", attachmentsMulter, attachments);
router.route("/:id").get(getChatDetails).post(renameGroup).delete(deleteChat)
router.route("/message/:id").get(getMessage)

export default router;

import { Router } from "express";
import { createDMChat, searchUser } from "../controllers/user.js";

const router = Router()

router.post("/newChat", createDMChat);
router.get("/search", searchUser);

export default router;

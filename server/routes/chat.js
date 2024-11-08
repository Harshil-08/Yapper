import express from "express";
import { newGroupChat } from "../controllers/chat.js";

const router = express.Router();

router.post("/new", newGroupChat);

export default router;

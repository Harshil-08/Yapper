import { Router } from "express";
import { login, signup, signout, googleAuth } from "../controllers/auth.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleAuth);
router.post("/signout", signout);

export default router;


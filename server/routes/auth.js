import { Router } from "express";
import { login, signup, signout, googleAuth } from "../controllers/auth.js";
import { singleAvater } from "../middlewares/multer.js";

const router = Router();

router.post("/signup",singleAvater, signup);
router.post("/login", login);
router.post("/google", googleAuth);
router.post("/signout", signout);

export default router;


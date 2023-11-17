import express from "express";
const router = express.Router();
import { signUp, login, userLogout } from "../controller/userController.js";

router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", userLogout);

export default router;

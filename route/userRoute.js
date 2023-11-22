import express from "express";
const router = express.Router();
import {
  signUp,
  login,
  userLogout,
  verifyOtp,
  editProfile,
} from "../controller/userController.js";
import { verifyAccess } from "../middleware/userMiddleware.js";

router.post("/signup", signUp);
router.post("/login", verifyAccess, login);
router.post("/logout", userLogout);
router.post("/verifyOtp", verifyOtp);
router.post("/editProfile",editProfile)

export default router;

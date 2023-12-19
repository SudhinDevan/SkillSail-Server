import express from "express";
const router = express.Router();

import { signIn } from "../controller/adminController.js";

import {
  signUp,
  login,
  verifyOtp,
  handleRefreshToken,
} from "../controller/userController.js";

import { userLogout } from "../controller/userController.js";

import { verifyAccess } from "../middleware/userAuthMiddleware.js";

router.get("/refresh", handleRefreshToken);
router.post("/admin/login", signIn);
router.get("/logout", userLogout);
router.post("/signup", signUp);
router.post("/login", verifyAccess, login);
router.post("/verifyOtp", verifyOtp);

export default router;

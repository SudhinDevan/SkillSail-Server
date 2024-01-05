import express from "express";
const router = express.Router();

import { signIn } from "../controller/adminController.js";

import {
  signUp,
  login,
  verifyOtp,
  handleRefreshToken,
  forgotPassword,
  changePassword,
} from "../controller/userController.js";

import { userLogout } from "../controller/userController.js";

import { verifyAccess } from "../middleware/userAuthMiddleware.js";
import { dashboardBlog } from "../controller/blogController.js";

router.get("/refresh", handleRefreshToken);
router.post("/forgotPassword", forgotPassword);
router.post("/admin/login", signIn);
router.get("/logout", userLogout);
router.post("/signup", signUp);
router.post("/login", verifyAccess, login);
router.post("/verifyOtp", verifyOtp);
router.post("/changePassword", changePassword);
router.get("/blog", dashboardBlog);

export default router;

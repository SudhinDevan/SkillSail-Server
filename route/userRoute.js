import express from "express";
const router = express.Router();
import {
  signUp,
  login,
  verifyToken,
  getUser,
} from "../controller/userController.js";

router.post("/signup", signUp);
router.post("/login", login);
router.get("/user", verifyToken, getUser);

export default router;

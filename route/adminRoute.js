import express from "express";
const router = express.Router();

import {
  adminLogout,
  signIn,
  teacherAccessChanger,
  teacherListing,
  userAccessChanger,
  userListing,
} from "../controller/adminController.js";

router.post("/login", signIn);
router.post("/logout", adminLogout);
router.get("/userlist", userListing);
router.put("/userAccess", userAccessChanger);
router.get("/teachers", teacherListing);
router.put("/teacherAccess", teacherAccessChanger);

export default router;

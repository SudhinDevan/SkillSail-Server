import express from "express";
const router = express.Router();

import {
  adminLogout,
  approveTeacher,
  teacherAccessChanger,
  teacherApprovalListing,
  teacherListing,
  userAccessChanger,
  userListing,
} from "../controller/adminController.js";

router.post("/logout", adminLogout);

router.get("/userlist", userListing);
router.put("/userAccess", userAccessChanger);
router.get("/teacherRequest", teacherApprovalListing);
router.put("/teacherAccess", teacherAccessChanger);
router.post("/approveTeacher", approveTeacher);
router.get("/teacherListing", teacherListing)

export default router;

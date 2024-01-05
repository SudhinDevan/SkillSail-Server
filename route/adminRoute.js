import express from "express";
const router = express.Router();

import {
  adminLogout,
  approveTeacher,
  courseListing,
  dashboardData,
  paymentToTutor,
  teacherAccessChanger,
  teacherApprovalListing,
  teacherListing,
  transactions,
  userAccessChanger,
  userListing,
} from "../controller/adminController.js";

router.post("/logout", adminLogout);

router.get("/userlist", userListing);
router.get("/courseList", courseListing);
router.get("/transactions", transactions);
router.post("/payTutor", paymentToTutor);
router.put("/userAccess", userAccessChanger);
router.get("/teacherRequest", teacherApprovalListing);
router.put("/teacherAccess", teacherAccessChanger);
router.post("/approveTeacher", approveTeacher);
router.get("/teacherListing", teacherListing);
router.get("/dashboardData", dashboardData)

export default router;

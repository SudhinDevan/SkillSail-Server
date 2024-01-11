import express from "express";
const router = express.Router();

import {
  editImage,
  editProfile,
  profileDetails,
  transactions,
  userCourses,
} from "../controller/userController.js";

import {
  courseDetailsForUser,
  handleReview,
  listCourses,
  chapterDetails,
} from "../controller/courseController.js";

import {
  paymentOrder,
  verifyPayment,
} from "../controller/paymentController.js";

import { blogDetials, displayBlogs } from "../controller/blogController.js";
import { getChatDetails } from "../controller/chatController.js";

router.post("/editProfile", editProfile);
router.get("/courses", listCourses);
router.get("/courseDetails", courseDetailsForUser);
router.get("/chapterDetails", chapterDetails);
router.put("/editImage", editImage);
router.get("/profileDetails", profileDetails);
router.post("/payment", paymentOrder);
router.post("/payment/verify", verifyPayment);
router.get("/blogList", displayBlogs);
router.post("/myCourses", userCourses);
router.get("/blogDetails", blogDetials);
router.post("/courseReview", handleReview);
router.get("/transactions", transactions)
router.get("/chatDetails", getChatDetails)

export default router;

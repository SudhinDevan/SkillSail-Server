import express from "express";
const router = express.Router();
import {
  editImage,
  editProfile,
  profileDetails,
  userCourses,
} from "../controller/userController.js";

import {
  courseDetailsForUser,
  handleReview,
  listCourses,
} from "../controller/courseController.js";

import {
  paymentOrder,
  verifyPayment,
} from "../controller/paymentController.js";

import { blogDetials, displayBlogs } from "../controller/blogController.js";

router.post("/editProfile", editProfile);
router.get("/courses", listCourses);
router.get("/courseDetails", courseDetailsForUser);
router.put("/editImage", editImage);
router.get("/profileDetails", profileDetails);
router.post("/payment", paymentOrder);
router.post("/payment/verify", verifyPayment);
router.get("/blogList", displayBlogs);
router.post("/myCourses", userCourses);
router.get("/blogDetails", blogDetials);
router.post("/courseReview", handleReview);

export default router;

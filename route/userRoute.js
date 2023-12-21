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
  listCourses,
} from "../controller/courseController.js";
import {
  paymentOrder,
  verifyPayment,
} from "../controller/paymentController.js";

router.post("/editProfile", editProfile);
router.get("/courses", listCourses);
router.get("/courseDetails", courseDetailsForUser);
router.put("/editImage", editImage);
router.get("/profileDetails", profileDetails);
router.post("/payment", paymentOrder);
router.post("/payment/verify", verifyPayment);
router.post("/myCourses", userCourses);

export default router;

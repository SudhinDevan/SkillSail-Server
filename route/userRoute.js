import express from "express";
const router = express.Router();
import {
  editImage,
  editProfile,
  profileDetails,
} from "../controller/userController.js";

import {
  courseDetailsForUser,
  listCourses,
} from "../controller/courseController.js";

router.post("/editProfile", editProfile);
router.get("/courses", listCourses);
router.get("/courseDetails", courseDetailsForUser);
router.put("/editImage", editImage);
router.get("/profileDetails", profileDetails);
// router.post("/profile/displayimage", dispayImage);

export default router;

import express from "express";
const router = express.Router();

import {
  coursesListing,
  createCourse,
} from "../controller/vendorController.js";
import {
  chapterDetails,
  chapterListing,
  courseDetails,
  createChapter,
} from "../controller/courseController.js";

router.post("/createCourse", createCourse);
router.get("/courseList", coursesListing);
router.get("/courseDetails", courseDetails);
router.post("/createChapter", createChapter);
router.get("/chapterListing", chapterListing);
router.get("/chapterDetails", chapterDetails);

export default router;

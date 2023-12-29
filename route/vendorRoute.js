import express from "express";
const router = express.Router();

import {
  coursesListing,
  createCourse,
  publicCoursesListing,
  tutorEditImage,
  tutorProfileDetails,
  userListing,
} from "../controller/vendorController.js";

import {
  chapterDetails,
  chapterListing,
  courseDetails,
  createChapter,
  deleteChapter,
  editCourse,
} from "../controller/courseController.js";

import { blogListing, createBlog } from "../controller/blogController.js";

router.post("/createCourse", createCourse);
router.post("/createBlog", createBlog);
router.get("/courseList", coursesListing);
router.get("/publicCourseList", publicCoursesListing);
router.get("/blogList", blogListing);
router.get("/courseDetails", courseDetails);
router.post("/createChapter", createChapter);
router.put("/editImage", tutorEditImage);
router.get("/profileDetails", tutorProfileDetails);
router.get("/chapterListing", chapterListing);
router.get("/chapterDetails", chapterDetails);
router.put("/courseDetails/edit", editCourse);
router.delete("/courseDetails/chapter/:chapterId", deleteChapter);
router.post("/studentListing", userListing);

export default router;

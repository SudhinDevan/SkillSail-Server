import express from "express";
const router = express.Router();

import {
  coursesListing,
  createCourse,
  userListing,
} from "../controller/vendorController.js";

import {
  chapterDetails,
  chapterListing,
  courseDetails,
  createChapter,
  deleteChapter,
} from "../controller/courseController.js";

import { blogListing, createBlog } from "../controller/blogController.js";

router.post("/createCourse", createCourse);
router.post("/createBlog", createBlog);
router.get("/courseList", coursesListing);
router.get("/blogList", blogListing);
router.get("/courseDetails", courseDetails);
router.post("/createChapter", createChapter);
router.get("/chapterListing", chapterListing);
router.get("/chapterDetails", chapterDetails);
router.delete("/courseDetails/chapter/:chapterId", deleteChapter);
router.post("/studentListing", userListing);

export default router;

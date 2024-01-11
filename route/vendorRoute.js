import express from "express";
const router = express.Router();

import {
  coursesListing,
  createCourse,
  publicCoursesListing,
  test,
  tutorEditImage,
  tutorProfileDetails,
  userListing,
} from "../controller/vendorController.js";

import {
  chapterDetails,
  chapterListing,
  courseDetails,
  createChapter,
  dashboardData,
  deleteChapter,
  editCourse,
} from "../controller/courseController.js";

import {
  blogDetials,
  blogListing,
  createBlog,
  deleteBlog,
  editBlog,
} from "../controller/blogController.js";

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
router.get("/blogDetails", blogDetials);
router.post("/editBlog", editBlog);
router.put("/courseDetails/edit", editCourse);
router.delete("/courseDetails/chapter/:chapterId", deleteChapter);
router.delete("/deleteBlog/:blogId", deleteBlog);
router.post("/studentListing", userListing);
router.get("/dashboardData", dashboardData);
router.get("/test", test)

export default router;

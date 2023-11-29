import express from "express";
const router = express.Router();

import { coursesListing, createCourse } from "../controller/vendorController.js";

router.post("/createCourse", createCourse);
router.get("/courses", coursesListing)




export default router;

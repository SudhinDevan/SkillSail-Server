import userModel from "../model/userSchema.js";
import CourseModel from "../model/courses.js";
import { cloudinary } from "../config/cloudinary.js";

const createCourse = async (req, res) => {
  try {
    const data = req.body;
    if (!data || !data.inputs || !data.image) {
      return res.status(400).json({ error: true, message: "Invalid request body" });
    }
    const {inputs:{coursename, blurb, description, aboutAuthor, price, email}, image} = data;
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }
    if (image) {
      let file;
      file = await cloudinary.uploader.upload(image, {
        folder: "SkillSail",
      });
      const newCourse = new CourseModel({
        courseName: coursename,
        blurb: blurb,
        description: description,
        aboutAuthor: aboutAuthor,
        price: price,
        tutor: user._id,
        chapters: [],
        thumbnail: file,
      });
      await newCourse.save();
      return res.status(200).json({
        error: false,
        message: "course created successfully",
        course: newCourse,
      });
    }
  } catch (err) {
    console.error("Unexpected error:", err.message);
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

const coursesListing = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: email });
    const coursesList = await CourseModel.find({ _id: user._id }).sort({
      courseName: 1,
    });
    console.log(coursesList);
    res.json(coursesList);
  } catch (error) {
    res.json(error);
  }
};

export { createCourse, coursesListing };

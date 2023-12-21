import userModel from "../model/userSchema.js";
import courseModel from "../model/courses.js";
import { cloudinary } from "../config/cloudinary.js";

const createCourse = async (req, res) => {
  try {
    const data = req.body;
    if (!data || !data.inputs || !data.image) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid request body" });
    }
    const {
      inputs: { coursename, blurb, description, aboutAuthor, price, email },
      image,
    } = data;
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }
    if (image) {
      let file;
      file = await cloudinary.uploader.upload(image, {
        folder: "SkillSail",
      });
      const newCourse = new courseModel({
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
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

const coursesListing = async (req, res) => {
  try {
    const userEmail = req.query.email;
    const user = await userModel.findOne({ email: userEmail });
    const coursesList = await courseModel.find({ tutor: user._id }).sort({
      courseName: 1,
    });
    res
      .status(200)
      .json({ message: "courses fetched successfully", coursesList });
  } catch (error) {
    res.json(error);
  }
};

const userListing = async (req, res) => {
  try {
    const { id } = req.body;
    const tutorCourses = await courseModel
      .find({ tutor: id })
      .populate("students");
    const studentsWithCourses = [];
    // Iterate through the courses and extract students with their enrolled courses
    tutorCourses.forEach((course) => {
      course.students.forEach((student) => {
        studentsWithCourses.push({
          student: student,
          course: {
            _id: course._id,
            courseName: course.courseName,
            price: course.price,
            // Add other course details you want to include
          },
        });
      });
    });

    return res.status(200).json({
      message: "Student list with enrolled courses successfully fetched",
      studentsWithCourses,
    });
  } catch (error) {
    console.error("Error in userListing:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export { createCourse, coursesListing, userListing };

import courseModel from "../model/courses.js";
import chapterModel from "../model/chapters.js";
import { cloudinary } from "../config/cloudinary.js";

const courseDetails = async (req, res) => {
  const course = req.query.courseId;
  try {
    const courseData = await courseModel.findOne({ _id: course });
    if (!courseData) {
      res.status(404).json({ message: "Invalid Request" });
      return;
    }
    return res.status(200).json({ message: "success", courseData });
  } catch (err) {
    console.log(err.message);
  }
};

const createChapter = async (req, res) => {
  try {
    const data = req.body;
    const course = await courseModel.findOne({ _id: data.inputs.courseId });
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    if (data.file) {
      let file;
      file = await cloudinary.uploader.upload(data.file, {
        resource_type: "video",
        folder: "SkillSail",
      });

      const chapter = new chapterModel({
        chapterName: data.inputs.chapterName,
        description: data.inputs.description,
        video: file,
        course: data.inputs.courseId,
        index: data.inputs.chapterNum,
      });
      await chapter.save();
      res.status(201).json({ message: "Chapter saved successfully", chapter });
    }
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ error: "Validation Error", details: error.errors });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const chapterListing = async (req, res) => {
  try {
    const chapter = req.query.courseId;
    const chapterData = await chapterModel.find({ course: chapter });
    if (!chapterData) {
      res.status(404).json({ message: "Invalid Request" });
      return;
    }
    return res.status(200).json({ message: "success", chapterData });
  } catch (err) {
    console.log(err.message);
  }
};

const listCourses = async (req, res) => {
  try {
    const courses = await courseModel.find().sort({ createdAt: -1 });
    return res.status(200).json({ message: "success", courses });
  } catch (err) {
    console.log(err.message);
  }
};

export { courseDetails, createChapter, chapterListing, listCourses };

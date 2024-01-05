import courseModel from "../model/courses.js";
import chapterModel from "../model/chapters.js";
import courseReviewModel from "../model/courseReview.js";
import { cloudinary } from "../config/cloudinary.js";
import mongoose from "mongoose";
import paymentModel from "../model/payment.js";
const { ObjectId } = mongoose.Types;

const courseDetails = async (req, res) => {
  const course = req.query.courseId;
  try {
    const courseData = await courseModel.findOne({ _id: course }).populate({
      path: "reviews",
      populate: {
        path: "user",
      },
    });
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

const chapterDetails = async (req, res) => {
  try {
    const chapter = req.query.chapterId;
    const chapterDetails = await chapterModel.findOne({ _id: chapter });
    if (!chapterDetails) {
      return res.status(404).json({ message: "Invalid ChapterId" });
    }
    return res.status(200).json({ message: "success", chapterDetails });
  } catch (err) {
    console.log(err.message);
  }
};

const deleteChapter = async (req, res) => {
  try {
    const { chapterId } = req.params;

    const chapter = await chapterModel.findById(chapterId);

    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found" });
    }

    const deletionResult = await chapterModel.deleteOne({ _id: chapterId });

    if (deletionResult.deletedCount === 0) {
      return res.status(400).json({ message: "Chapter deletion failed" });
    }

    return res.status(200).json({ message: "Successfully deleted" });
  } catch (err) {
    console.error("Error deleting chapter:", err);
    return res.status(500).json({ message: "Internal Server Error" });
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

const courseDetailsForUser = async (req, res) => {
  try {
    const courseId = req.query.courseId;
    const course = await courseModel.findOne({ _id: courseId }).populate({
      path: "reviews",
      populate: {
        path: "user",
      },
    });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    const chapter = await chapterModel.find({ course: courseId });
    return res.status(200).json({ message: "success", course, chapter });
  } catch (err) {
    return res.status(400).json({ err });
  }
};

const editCourse = async (req, res) => {
  try {
    const details = req.body;
    let file;
    if (details.image) {
      file = await cloudinary.uploader.upload(details.image, {
        folder: "SkillSail",
      });
    }

    const course = await courseModel.findOneAndUpdate(
      { _id: details.changes.courseId },
      {
        $set: {
          blurb: details.changes.Blurb || undefined,
          description: details.changes.Description || undefined,
          isCompleted: details.isChecked,
          price: details.changes.Price || undefined,
          courseName: details.changes.courseName || undefined,
          thumbnail: file || undefined,
        },
      },
      { new: true }
    );

    return res.status(200).json({ message: "Successfully Updated", course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const dashboardData = async (req, res) => {
  try {
    const id = req.query.id;
    const student = await paymentModel.find({ tutor: id });
    const studentCount = student.length;
    const course = await courseModel.find({ tutor: id });
    const courseCount = course.length;
    const publicCourses = await courseModel.find({
      tutor: id,
      isCompleted: true,
    });
    const publicCourseCount = publicCourses.length;
    const payments = await paymentModel.find({ tutor: id });
    const totalRevenue = payments.reduce(
      (total, payment) => total + payment.price,
      0
    );
    const tableData = await paymentModel
      .find({ tutor: id })
      .populate("course user")
      .sort({ createdAt: -1 })
      .limit(3);

    return res.status(200).json({
      message: "success",
      studentCount,
      courseCount,
      publicCourseCount,
      totalRevenue,
      tableData,
    });
  } catch (error) {
    console.log(error);
  }
};

const handleReview = async (req, res) => {
  try {
    console.log(req.body);
    const { rating, review, courseId, userId } = req.body;
    const user = new mongoose.Types.ObjectId(userId);
    console.log("user", user);
    const newReview = courseReviewModel({
      rating,
      review,
      user,
    });

    const newAddedReview = await newReview.save();
    await courseModel.findByIdAndUpdate(courseId, {
      $push: { reviews: newAddedReview._id },
    });
    res.status(200).json({ message: "review added" });
  } catch (error) {
    console.log(error);
  }
};

export {
  courseDetails,
  createChapter,
  chapterListing,
  listCourses,
  courseDetailsForUser,
  chapterDetails,
  deleteChapter,
  editCourse,
  dashboardData,
  handleReview,
};

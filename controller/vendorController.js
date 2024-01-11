import userModel from "../model/userSchema.js";
import courseModel from "../model/courses.js";
import { cloudinary } from "../config/cloudinary.js";

const createCourse = async (req, res, next) => {
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
    next(err);
  }
};

const coursesListing = async (req, res, next) => {
  try {
    const userEmail = req.query.email;
    const user = await userModel.findOne({ email: userEmail });
    const coursesList = await courseModel
      .find({ tutor: user._id, isCompleted: false })
      .sort({
        courseName: 1,
      });
    res
      .status(200)
      .json({ message: "courses fetched successfully", coursesList });
  } catch (err) {
    next(err);
  }
};

const publicCoursesListing = async (req, res, next) => {
  try {
    const userEmail = req.query.email;
    const user = await userModel.findOne({ email: userEmail });
    const coursesList = await courseModel
      .find({ tutor: user._id, isCompleted: true })
      .sort({
        courseName: 1,
      });
    res
      .status(200)
      .json({ message: "courses fetched successfully", coursesList });
  } catch (err) {
    next(err);
  }
};

const userListing = async (req, res, next) => {
  try {
    const { id, currentPage } = req.body;
    const tutorCourses = await courseModel.find({ tutor: id }).populate({
      path: "students",
      select: "name email",
    });
    const limit = 3;
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
    const totalCount = studentsWithCourses.length;
    console.log(studentsWithCourses);
    console.log(studentsWithCourses.length);
    const filteredData = studentsWithCourses.slice(
      (currentPage - 1) * limit,
      currentPage * limit
    );

    return res.status(200).json({
      message: "Student list with enrolled courses successfully fetched",
      tutorCourses: filteredData, totalCount: totalCount
    });
  } catch (err) {
    next(err);
  }
};

const tutorEditImage = async (req, res, next) => {
  try {
    const { email, file } = req.body;
    let dp;
    if (file) {
      dp = await cloudinary.uploader.upload(file, {
        folder: "SkillSail",
      });
    }
    const user = await userModel.findOneAndUpdate(
      { email: email },
      { $set: { profilePic: dp } },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "Successfully updated display image", user });
  } catch (err) {
    next(err);
  }
};

const tutorProfileDetails = async (req, res, next) => {
  try {
    const email = req.query.email;
    const user = await userModel
      .findOne({ email: email })
      .populate("appliedCourses");
    const course = await courseModel
      .find({ tutor: user._id })
      .sort({ createdAt: -1 });
    return res.status(200).json({ message: "success", user, course });
  } catch (err) {
    next(err);
  }
};

const test = async (req, res) => {
  const search = req.query.searchItem;
  const id = req.query.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const tutorCourses = await courseModel
    .find({ tutor: id })
    .populate({
      path: "students",
      ref: "user",
    })
    .skip((page - 1) * limit)
    .limit(limit);
  const studentsWithCourses = [];

  const searchRegex = new RegExp(search, "i");

  tutorCourses.forEach((course) => {
    course.students.forEach((student) => {
      if (searchRegex.test(student.email)) {
        studentsWithCourses.push({
          student: student,
          course: {
            _id: course._id,
            courseName: course.courseName,
            price: course.price,
          },
        });
      }
    });
  });

  return res.status(200).json({
    message: "Student list with enrolled courses successfully fetched",
    studentsWithCourses,
  });
};

////////////////////////////////////////////////////////
// const getMyCourse = async (req, res) => {
//   try {
//     const userId = req.userId;
// const courses = await courseModel
//   .find({ users: userId })
//   .populate("category");

// const ITEMS_PER_PAGE = 6;
// let page = +req.query.page || 1;
// const search = req.query.search || "";
// const search = req.query.search !== 'undefined' ? req.query.search : "";
//     let search = "";
//     if (req.query.search !== "undefined") {
//       search = req.query.search;
//       page = 1;
//     }

//     const query = {
//       users: userId,
//       title: { $regex: new RegExp(`^${search}`, "i") },
//     };

//     const allCourses = await courseModel.find(query).populate("category");

//     const startIndex = (page - 1) * ITEMS_PER_PAGE;
//     const lastIndex = page * ITEMS_PER_PAGE;

//     const results = {};
//     results.totalCourse = allCourses.length;
//     results.pageCount = Math.ceil(allCourses.length / ITEMS_PER_PAGE);

//     if (lastIndex < allCourses.length) {
//       results.next = {
//         page: page + 1,
//       };
//     }

//     if (startIndex > 0) {
//       results.prev = {
//         page: page - 1,
//       };
//     }

//     results.page = page - 1;
//     results.courses = allCourses.slice(startIndex, lastIndex);

//     res.status(200).json({ results });
//   } catch (error) {
//     console.log(error);
//   }
// };
///////////////////////////////////////////////////
// };

export {
  createCourse,
  coursesListing,
  userListing,
  tutorEditImage,
  tutorProfileDetails,
  publicCoursesListing,
  test,
};

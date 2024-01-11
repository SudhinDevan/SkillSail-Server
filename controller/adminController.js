import userModel from "../model/userSchema.js";
import courseModel from "../model/courses.js";
import paymentModel from "../model/payment.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

let jwtPrivateKey = process.env.JWT_SECRET_KEY;
let jwtSecureKey = process.env.JWT_SECURE_KEY;

const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email: email });
    if (user != null && user.role === 1000) {
      const passwordVerify = await bcrypt.compare(password, user.password);
      if (passwordVerify) {
        const accessToken = jwt.sign({ userId: user._id }, jwtPrivateKey, {
          expiresIn: "30s",
        });

        const refreshToken = jwt.sign({ userId: user._id }, jwtSecureKey, {
          expiresIn: "1d",
        });

        res.cookie("jwt", refreshToken, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        });

        user.refreshToken = refreshToken;
        await user.save();

        const sanitizedUser = {
          role: user.role,
          email: user.email,
        };
        return res.status(200).json({
          message: "login Succcessfull",
          accessToken,
          user: sanitizedUser,
        });
      } else {
        return res.status(404).json({ message: "Invalid Credentials" });
      }
    } else {
      return res.status(404).json({ message: "Invalid user" });
    }
  } catch (err) {
    next(err);
  }
};

const adminLogout = async (req, res, next) => {
  try {
    res.clearCookie("jwt", { httpOnly: true });
    return res.status(200).json({ message: "logged out", error: false });
  } catch (err) {
    next(err);
  }
};

const userListing = async (req, res, next) => {
  try {
    const userList = await userModel.find({ role: 2000 }).sort({ name: 1 });
    res.status(200).json({ message: "Users fetched successfully", userList });
  } catch (err) {
    next(err);
  }
};

const teacherApprovalListing = async (req, res, next) => {
  try {
    const teacherList = await userModel
      .find({ role: 3000, $and: [{ isVerified: false }] })
      .sort({ name: 1 });
    res.status(200).json(teacherList);
  } catch (err) {
    next(err);
  }
};

const teacherListing = async (req, res, next) => {
  try {
    const teacherList = await userModel
      .find({ role: 3000, $and: [{ isVerified: true }] })
      .sort({ name: 1 });
    res.status(200).json(teacherList);
  } catch (err) {
    next(err);
  }
};

const userAccessChanger = async (req, res, next) => {
  try {
    const { email, isAccess } = req.body;
    const updateAccess = !isAccess;
    const user = await userModel.findOneAndUpdate(
      { email: email },
      { $set: { isAccess: updateAccess } }
    );
    res.json(user);
  } catch (err) {
    next(err);
  }
};

const teacherAccessChanger = async (req, res, next) => {
  try {
    const { email, isAccess } = req.body;
    const updateAccess = !isAccess;
    const teacher = await userModel.findOneAndUpdate(
      { email: email },
      { $set: { isAccess: updateAccess } }
    );
    res.json(teacher);
  } catch (err) {
    next(err);
  }
};

const approveTeacher = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOneAndUpdate(
      { email: email },
      { $set: { isVerified: true } },
      { new: true }
    );
    return res.status(200).json({ message: "Teacher Approved" });
  } catch (err) {
    next(err);
  }
};

const courseListing = async (req, res, next) => {
  try {
    const course = await courseModel.find().populate("tutor");
    return res
      .status(200)
      .json({ message: "Course fetched successfully", course });
  } catch (err) {
    next(err);
  }
};

const transactions = async (req, res, next) => {
  try {
    const statement = await paymentModel
      .find()
      .populate("course")
      .populate("tutor")
      .populate("user");
    return res
      .status(200)
      .json({ message: "Transactions fetched successfully", statement });
  } catch (err) {
    next(err);
  }
};

const paymentToTutor = async (req, res, next) => {
  try {
    const { id } = req.body;
    const payment = await paymentModel.findOneAndUpdate(
      { _id: id },
      { $set: { paymentToTutor: true } },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "Payment Modified Successfully", payment });
  } catch (err) {
    next(err);
  }
};

const dashboardData = async (req, res, next) => {
  try {
    const student = await paymentModel.find();
    const studentCount = student.length;
    const course = await courseModel.find();
    const courseCount = course.length;
    const publicCourses = await courseModel.find({
      isCompleted: true,
    });
    const publicCourseCount = publicCourses.length;
    const payments = await paymentModel.find();
    const totalRevenue = payments.reduce(
      (total, payment) => total + payment.price,
      0
    );
    const tableData = await paymentModel
      .find()
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
  } catch (err) {
    next(err);
  }
};

export {
  signIn,
  adminLogout,
  userListing,
  userAccessChanger,
  teacherApprovalListing,
  teacherListing,
  teacherAccessChanger,
  courseListing,
  approveTeacher,
  transactions,
  paymentToTutor,
  dashboardData,
};

import userModel from "../model/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

let jwtPrivateKey = process.env.JWT_SECRET_KEY;
let jwtSecureKey = process.env.JWT_SECURE_KEY;

const signIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email: email });
  if (user != null && user.role === 1000) {
    const passwordVerify = await bcrypt.compare(password, user.password);
    if (passwordVerify) {
      const accessToken = jwt.sign({ id: user._id }, jwtPrivateKey, {
        expiresIn: "30s",
      });

      const refreshToken = jwt.sign({ id: user._id }, jwtSecureKey, {
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
};

const adminLogout = async (req, res) => {
  try {
    res.clearCookie("jwt", { httpOnly: true });
    return res.status(200).json({ message: "logged out", error: false });
  } catch (error) {
    console.error("Error clearing cookie:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: true });
  }
};

const userListing = async (req, res) => {
  try {
    const userList = await userModel.find({ role: 2000 }).sort({ name: 1 });
    res.status(200).json(userList);
  } catch (error) {
    res.json(error);
  }
};

const teacherApprovalListing = async (req, res) => {
  try {
    const teacherList = await userModel
      .find({ role: 3000, $and: [{ isVerified: false }] })
      .sort({ name: 1 });
    res.status(200).json(teacherList);
  } catch (error) {
    res.json(error);
  }
};

const teacherListing = async (req, res) => {
  try {
    const teacherList = await userModel
      .find({ role: 3000, $and: [{ isVerified: true }] })
      .sort({ name: 1 });
    res.status(200).json(teacherList);
  } catch (error) {
    res.json(error);
  }
};

const userAccessChanger = async (req, res) => {
  const { email, isAccess } = req.body;
  const updateAccess = !isAccess;
  const user = await userModel.findOneAndUpdate(
    { email: email },
    { $set: { isAccess: updateAccess } }
  );
  res.json(user);
};

const teacherAccessChanger = async (req, res) => {
  const { email, isAccess } = req.body;

  const updateAccess = !isAccess;
  const teacher = await userModel.findOneAndUpdate(
    { email: email },
    { $set: { isAccess: updateAccess } }
  );
  res.json(teacher);
};

const approveTeacher = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOneAndUpdate(
      { email: email },
      { $set: { isVerified: true } },
      { new: true }
    );
    return res.status(200).json({ message: "Teacher Approved" });
  } catch (error) {
    console.error("Error approving teacher:", error);
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
  approveTeacher,
};

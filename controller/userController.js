import User from "../model/userSchema.js";
import coursesModel from "../model/courses.js";
import OtpModel from "../model/otp.js";
import bcrypt, { genSalt } from "bcrypt";
import { cloudinary } from "../config/cloudinary.js";
import { verifyEmail } from "../config/sendMail.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

let accessTokenKey = process.env.JWT_SECRET_KEY;
let refreshTokenKey = process.env.JWT_SECURE_KEY;

const signUp = async (req, res) => {
  try {
    const { name, email, phone, password, isAccess, role, verifyDocument } =
      req.body;
    let existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(400).json({
        message: "The user already exists! Please login.",
      });
    }
    let file;
    if (verifyDocument) {
      file = await cloudinary.uploader.upload(verifyDocument, {
        folder: "SkillSail",
      });
    }
    const saltRounds = 10;
    const genSalt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, genSalt);

    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      isAccess,
      role,
      verifyDocument: file,
    });

    await user.save();

    return res.json({
      error: false,
      message: "Registration successful",
      user: user,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  let existingUser = req.user;
  if (existingUser.isAccess) {
    const accessToken = jwt.sign({ 'userId': existingUser._id }, accessTokenKey, {
      expiresIn: "30s",
    });

    const refreshToken = jwt.sign({ 'userId': existingUser._id }, refreshTokenKey, {
      expiresIn: "1d",
    });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    existingUser.refreshToken = refreshToken;
    await existingUser.save();

    const sanitizedUser = {
      id: existingUser.id,
      name: existingUser.name,
      phone: existingUser.phone,
      email: existingUser.email,
      role: existingUser.role,
    };

    res
      .status(200)
      .json({ message: "login successfull", user: sanitizedUser, accessToken });
  } else {
    return res.status(401).json({ message: "Access Denied" });
  }
};

const handleRefreshToken = async (req, res) => {
  try {
    const cookies = req.cookies;
    // console.log("cookie", cookies.jwt);
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    const userData = await User.findOne({ refreshToken: refreshToken });
    // console.log("user", userData);
    if (!userData) return res.sendStatus(403);

    jwt.verify(refreshToken, refreshTokenKey, (err, decoded) => {
      if (err || !userData._id.equals(decoded.userId))
        // console.log("user", userData);
        return res.sendStatus(403);
      const accessToken = jwt.sign({ 'userId': decoded.userId }, accessTokenKey, {
        expiresIn: "30s",
      });
      // console.log("accessToken", accessToken);
      res.json({ accessToken });
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteOtp = async (req, res) => {
  try {
    await OtpModel.deleteMany({
      createdAt: { $lt: new Date(Date.now() - 2 * 60 * 1000) },
    });
  } catch (error) {
    console.error("Error deleting expired OTP documents:", error);
  }
};

setInterval(deleteOtp, 60 * 1000);

const verifyOtp = async (req, res) => {
  const { data, otpValues } = req.body;
  const user = await OtpModel.findOne({ email: data.email });
  const otpString = otpValues.join("");
  if (user.otp == otpString) {
    const updateUser = await User.findOneAndUpdate(
      { email: user.email },
      { $set: { isVerified: true } }
    );
    return res
      .status(200)
      .json({ message: "successfully verified", updateUser });
  } else {
    return res.status(201).json({ message: "Incorrect OTP" });
  }
};

// const userLogout = async (req, res) => {
//   const userId = req.query.id;
//   const user = await User.findOneAndUpdate(
//     { _id: userId },
//     { $set: { refreshToken: "" } }
//   );
//   res
//     .cookie("token", "", {
//       httpOnly: true,
//       expires: new Date(0),
//       secure: true,
//       sameSite: "none",
//     })
//     .json({ message: "logged out", error: false });
// };

const userLogout = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt;

    const userData = await User.findOne({ refreshToken: refreshToken });
    if (!userData) {
      res.clearCookie("jwt", { httpOnly: true });
      return res.sendStatus(204);
    }
    userData.refreshToken = "";
    await userData.save();

    res.clearCookie("jwt", { httpOnly: true });
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
  }
};

const editProfile = async (req, res) => {
  const data = req.body;
  try {
    let updatedObject = {};
    if (data.name) {
      updatedObject.name = data.name;
    }
    if (data.phone) {
      updatedObject.phone = data.phone;
    }
    const user = await User.findOneAndUpdate(
      { email: data.email },
      { $set: updatedObject }
    );
    const updatedUser = await User.findOne({ email: user.email });
    return res.status(200).json({ message: "profile edited", updatedUser });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const editImage = async (req, res) => {
  try {
    const { email, file } = req.body;
    let dp;
    if (file) {
      dp = await cloudinary.uploader.upload(file, {
        folder: "SkillSail",
      });
    }
    const user = await User.findOneAndUpdate(
      { email: email },
      { $set: { profilePic: dp } },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "Successfully updated display image", user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const profileDetails = async (req, res) => {
  try {
    const email = req.query.email;
    const user = await User.findOne({ email: email }).populate(
      "appliedCourses"
    );
    return res.status(200).json({ message: "success", user });
  } catch (err) {
    return res.status(400).json({ message: "error fetching data" });
  }
};

const userCourses = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findById(id);
    if (user.appliedCourses) {
      const appliedCourseIds = user.appliedCourses;
      const appliedCoursesDetails = await coursesModel.find({
        _id: { $in: appliedCourseIds },
      });
      return res.status(200).json({
        message: "courses fetched successfully",
        appliedCoursesDetails,
      });
    } else {
      return res.status(201).json({ message: "No courses purchased" });
    }
  } catch (error) {
    console.log(error);
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ messsage: "user not found" });
    }
    const OTP = Math.floor(Math.random() * 10000);

    const otpdetails = new OtpModel({
      name: user.name,
      email: user.email,
      otp: OTP,
    });

    const emailRecipients = {
      name: user.name,
      email: user.email,
      OTP,
    };
    console.log("otp: ", OTP);
    await otpdetails.save();
    const verify = await verifyEmail(emailRecipients);
    console.log("here");
    return res
      .status(200)
      .json({ message: "verify your account", user: emailRecipients });
  } catch (error) {
    console.log(error);
  }
};

const changePassword = async (req, res) => {
  const data = req.body;
  const user = await User.findById(data.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const saltRounds = 10;
  const genSalt = bcrypt.genSaltSync(saltRounds);
  const newPassword = bcrypt.hashSync(data.password, genSalt);

  user.password = newPassword;
  await user.save();

  res.status(200).json({ message: "Password changed Successfully" });
};

export {
  signUp,
  login,
  userLogout,
  verifyOtp,
  editProfile,
  handleRefreshToken,
  editImage,
  profileDetails,
  userCourses,
  forgotPassword,
  changePassword,
};

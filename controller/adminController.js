import userModel from "../model/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
let jwtPrivateKey = process.env.JWT_SECRET_KEY;


const signIn = async (req, res) => {
  const { email, password } = req.body;
  let admin;
  try {
    admin = await userModel.findOne({ email: email });
  } catch (err) {
    return new Error(err);
  }
  if (!admin || !admin.isAdmin) {
    return res.status(404).json({ message: "Invalid User" });
  }
  const passwordVerify = bcrypt.compare(password, admin.password);

  if (!passwordVerify) {
    return res.status(404).json({ message: "Invalid Credentials" });
  }

  const token = jwt.sign({ id: admin._id }, jwtPrivateKey, {
    expiresIn: "1d",
  });

  res.cookie("token", token, {
    path: "/admin",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res.status(200).json({ message: "login Succcessfull", token });
};

const adminLogout = async (req, res) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
      secure: true,
      sameSite: "none",
    })
    .json({ message: "logged out", error: false });
};

const userListing = async (req, res) => {
  try {
    const userList = await userModel.find({ role: 2000 }).sort({ name: 1 });
    res.status(200).json(userList);
  } catch (error) {
    res.json(error);
  }
};

const teacherListing = async (req, res) => {
  try {
    const teacherList = await userModel.find({ role: 3000 }).sort({ name: 1 });
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

export {
  signIn,
  adminLogout,
  userListing,
  userAccessChanger,
  teacherListing,
  teacherAccessChanger,
};

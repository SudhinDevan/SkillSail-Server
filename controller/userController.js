import User from "../model/userSchema.js";
import OtpModel from "../model/otp.js";
import bcrypt from "bcrypt";
import { cloudinary } from "../config/cloudinary.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

let jwtPrivateKey = process.env.JWT_SECRET_KEY;
let jwtSecureKey = process.env.JWT_SECURE_KEY;

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

  const accessToken = jwt.sign({ id: existingUser._id }, jwtPrivateKey, {
    expiresIn: "30s",
  });

  const refreshToken = jwt.sign({ id: existingUser._id }, jwtSecureKey, {
    expiresIn: "1d",
  });

  // res.cookie('jwt', refreshToken, {
  //   httpOnly: true,
  //   maxAge: 24 * 60 * 60 * 1000,
  //   secure: false,
  // });

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "None",
  });

  // console.log("Cookies sent:", res.getHeaders()["set-cookie"]);

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
};

const handleRefreshToken = async (req, res) => {
  try {
    const cookies = req.cookies;

    // console.log('hai',req.cookies.jwt);

    if (!cookies?.jwt) return res.sendStatus(401);
    console.log("sadfasdfklasdfl");
    const refreshToken = cookies.jwt;

    const userData = await User.findOne({ refreshToken: refreshToken });
    console.log(userData);
    console.log("1");
    if (!userData) return res.sendStatus(403);
    console.log("2");

    jwt.verify(refreshToken, process.env.jwtSecureKey, (err, decoded) => {
      if (err || userData.name !== decoded.username) return res.sendStatus(403);
      const accessToken = jwt.sign(
        { username: decoded.name },
        process.env.jwtPrivateKey,
        { expiresIn: "30s" }
      );
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

const userLogout = async (req, res) => {
  const userId = req.query.id;
  const user = await User.findOneAndUpdate(
    { _id: userId },
    { $set: { refreshToken: "" } }
  );
  res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
      secure: true,
      sameSite: "none",
    })
    .json({ message: "logged out", error: false });
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
    const user = await User.findOne({ email: email });
    return res.status(200).json({ message: "success", user });
  } catch (err) {
    return res.status(400).json({ message: "error fetching data" });
  }
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
};

////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

// const verifyToken = (req, res, next) => {
//   const cookies = req.headers.cookie;
//   const token = cookies.split("=")[1];
//   if (!token) {
//     return res.status(404).json({ message: "No token found" });
//   }
//   jwt.verify(String(token), jwtPrivateKey, (err, user) => {
//     if (err) {
//       return res.status(400).json({ message: "Invalid token" });
//     }
//     req.id = user.id;
//     next();
//   });
// };

// const getUser = async (req, res, next) => {
//   let id = req.id;
//   let user;
//   try {
//     user = await User.findById(id, "-password");
//   } catch (err) {
//     return new Error(err);
//   }
//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }
//   res.status(200).json({ user });
// };

// const refreshToken = (req, res, next) => {
//   const cookies = req.headers.cookie;
//   console.log("cookies: ", cookies);
//   const prevToken = cookies.split("=")[1];
//   if (!prevToken) {
//     res.status(400).json({ message: "Could'nt find token" });
//   }

//   jwt.verify(String(prevToken), jwtPrivateKey, (err, user) => {
//     if (err) {
//       res.status(400).json({ message: "Invalid Token" });
//     }
//     res.clearCookie(`${user.id}`);
//     req.cookies[`${user.id}`] = "";

//     const token = jwt.sign({ id: user.id }, jwtPrivateKey, {
//       expiresIn: "35s",
//     });

//     res.cookie(String(user.id), token, {
//       path: "/",
//       expires: new Date(Date.now() + 1000 * 30),
//       httpOnly: true,
//       samesite: "lax",
//     });
//     req.id = user.id;
//     next();
//   });
// };

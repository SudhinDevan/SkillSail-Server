import User from "../model/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config();
let jwtPrivateKey = process.env.JWT_SECRET_KEY;

const signUp = async (req, res, next) => {
  const { name, email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    console.log(err.message);
  }

  if (existingUser) {
    return res
      .status(400)
      .json({ message: "The user already exists ! Please Login" });
  }

  const saltRounds = 10;
  const genSalt = bcrypt.genSaltSync(saltRounds);

  const hashedPassword = bcrypt.hashSync(password, genSalt);

  const user = new User({
    name,
    email,
    password: hashedPassword,
  });

  try {
    await user.save();
  } catch (err) {
    console.log(err);
  }
  return res.status(200).json({ message: user });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return new Error(err);
  }
  if (!existingUser) {
    return res.status(400).json({ message: "User does not exist" });
  }
  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
  if (!isPasswordCorrect) {
    return res.status(404).json({ message: "Invalid Credentials" });
  }

  const token = jwt.sign({ id: existingUser._id }, jwtPrivateKey, {
    expiresIn: "35s",
  });

  res.cookie(String(existingUser._id), token, {
    path: "/",
    expires: new Date(Date.now() + 1000 * 30),
    httpOnly: true,
    sameSite: "lax",
  });

    return res
    .status(200)
    .json({ message: "login successfull", user: existingUser, token });
};

const verifyToken = async (req, res, next) => {
  const cookies = req.headers.cookie;
  const token = cookies.split("=")[1]  
  if (!token) {
    return res.status(404).json({ message: "No token found" });
  }
  jwt.verify(String(token), jwtPrivateKey, (err, user) => {
    if (err) {
      return res.status(400).json({ message: "Invalid token" });
    }
    console.log(user.id);
    req.id = user.id
  });
  next();
};

const getUser = async (req, res, next) => {
  let id = req.id;
  let user;
  try {
    user = await User.findById(id, "-password");
  } catch (err) {
    return new Error(err);
  }
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json({ user });
};

export { signUp, login, verifyToken, getUser };

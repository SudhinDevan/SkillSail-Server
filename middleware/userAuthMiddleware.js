import userModel from "../model/userSchema.js";
import OtpModel from "../model/otp.js";
import { verifyEmail } from "../config/sendMail.js";
import bcrypt from "bcrypt";

const verifyAccess = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await userModel.findOne({ email: email });
  } catch (err) {
    return new Error(err);
  }
  if (!existingUser) {
    return res.status(404).json({ message: "User does not exist" });
  }
  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
  if (!isPasswordCorrect) {
    res.status(401).json({ message: "Invalid Credentials" });
    return;
  }

  if (!existingUser.isVerified) {
    return res
      .status(401)
      .json({ message: "Please wait till the admin verifies your profile" });
  }

  if (!existingUser.isVerified && existingUser.role === 2000) {
    const OTP = Math.floor(Math.random() * 10000);

    const otpdetails = new OtpModel({
      name: existingUser.name,
      email,
      otp: OTP,
    });

    const emailRecipients = {
      name: existingUser.name,
      email,
      OTP,
    };
    console.log("otp: ", OTP);
    await otpdetails.save();
    const verify = await verifyEmail(emailRecipients);
    return res
      .status(201)
      .json({ message: "verify your account", user: emailRecipients });
  }
  req.user = existingUser;
  next();
};

export { verifyAccess };

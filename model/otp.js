import mongoose from "mongoose";

const { Schema, model } = mongoose;

const otpModel = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60, //one minute
  },
});

export default model("otpmodel", otpModel);

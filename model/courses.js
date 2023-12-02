import mongoose from "mongoose";

const { Schema, model } = mongoose;

const courses = new Schema({
  courseName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  price: {
    type: Number,
    required: true,
  },
  thumbnail: {
    type: Object,
  },
  blurb: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  aboutAuthor: {
    type: String,
    required: true,
  },
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  isShow: {
    type: Boolean,
    default: false,
  },
  review: {
    type: Array,
  },
});

export default model("course", courses);

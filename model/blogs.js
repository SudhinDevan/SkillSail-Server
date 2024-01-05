import mongoose from "mongoose";

const { Schema, model } = mongoose;

const blogs = new Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  blogHeading: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  thumbnail: {
    type: Object,
  },
  content: {
    type: String,
    required: true,
  }, 
});

export default model("blog", blogs);

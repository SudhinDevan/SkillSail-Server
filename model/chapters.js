import mongoose from "mongoose";

const { Schema, model } = mongoose;

const chapters = new Schema({
  chapterName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "course",
    required: true,
  },
  video: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
});

export default model("chapter", chapters);

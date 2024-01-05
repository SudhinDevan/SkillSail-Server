import mongoose from "mongoose";

const { Schema, model } = mongoose;

const courseReviewModel = new Schema({
  rating: {
    type: Number,
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default model("courseReview", courseReviewModel);

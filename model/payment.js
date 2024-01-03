import mongoose, { Model, MongooseError, mongo } from "mongoose";

const { Schema, model } = mongoose;

const paymentModel = new Schema({
  transactionId: {
    type: Object,
    default: {},
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "course",
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  paymentToTutor: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model("payment", paymentModel);

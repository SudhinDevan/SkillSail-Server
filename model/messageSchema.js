import mongoose from "mongoose";

const { Schema, model } = mongoose;

const messageSchema = new Schema({
  sender: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  content: {
    type: String,
    trim: true,
  },
  chat: {
    type: mongoose.Schema.ObjectId,
    ref: "chat",
  },
  timestamps: {
    type: Date,
    default: Date.now,
  },
});

export default model("message", messageSchema);

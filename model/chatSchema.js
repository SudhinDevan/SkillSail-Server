import mongoose from "mongoose";

const { Schema, model } = mongoose;

const chatSchema = new Schema(
  {
    conversationId: {
      type: String,
      required: true,
      unique: true,
    },
    participants: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    latestMessage: {
      type: mongoose.Schema.ObjectId,
      ref: "message",
    },
  },
  { timestamps: true }
);

export default model("chat", chatSchema);

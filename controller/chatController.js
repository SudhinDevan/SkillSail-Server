import userModel from "../model/userSchema.js";
import ChatModel from "../model/chatSchema.js";
import messageModel from "../model/messageSchema.js";
import dotenv from "dotenv";
import courses from "../model/courses.js";
import mongoose from "mongoose";
// import jwt from "jsonwebtoken";
import crypto from "crypto";
dotenv.config();

const getChatDetails = async (req, res, next) => {
  try {
    const id = req.query.id;
    const courseDetails = await userModel.findById(id).populate({
      path: "appliedCourses",
      populate: {
        path: "tutor",
        model: "User",
      },
    });

    return res.status(200).json({ message: "success", courseDetails });
  } catch (err) {
    next(err);
  }
};

function generateUniqueRoomId(senderId, recieverId) {
  const sortedIds = [senderId, recieverId].sort();
  const combineIds = sortedIds.join("");
  const roomId = crypto.createHash("sha1").update(combineIds).digest("hex");
  // console.log("generateUniqueRoomId");
  return roomId;
}

const sendMessage = async (data) => {
  try {
    const { textMessage, conversationId, recipientId, token, userId } = data;
    // console.log("conversationId", data);
    // const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const existingChat = await ChatModel.findOne({ conversationId });

    if (existingChat) {
      const newMessage = new messageModel({
        sender: userId,
        content: textMessage,
        chat: existingChat._id,
      });

      const message = await newMessage.save();
      existingChat.latestMessage = message._id;
      await existingChat.save();
      return;
    }

    const newChat = new ChatModel({
      conversationId,
      participants: [decodedToken.userId, recipientId],
    });

    const createdChat = await newChat.save();

    const newMessage = new messageModel({
      sender: userId,
      content: textMessage,
      chat: createdChat._id,
    });

    const message = await newMessage.save();
    createdChat.latestMessage = message._id;
    await createdChat.save();
  } catch (error) {
    console.log(error);
  }
};

const allMessages = async (req, res) => {
  try {
    const recipientId = req.params.id;
    const userId = req.userId;

    const conversationId = generateUniqueRoomId(userId, recipientId);
    // console.log("conversationId", conversationId);

    const existingChat = await ChatModel.findOne({ conversationId });

    if (!existingChat) {
      return res.status(200).json({ conversationId });
    }

    const messages = await messageModel
      .find({ chat: existingChat._id })
      .populate("sender", "name email _id");

    // console.log(conversationId);

    res.status(200).json({ existingChat, messages, conversationId });
  } catch (error) {}
};

const getAllTeachers = async (req, res) => {
  try {
    // console.log(req.userId);
    const user = new mongoose.Types.ObjectId(req.userId);
    const teacherIds = await courses.distinct("tutor", { students: user });

    let teachers = [];
    // console.log(teacherIds);

    for (const id of teacherIds) {
      const teacher = await userModel
        .findById(id)
        .select("name email _id profilePic");
      teachers.push(teacher);
    }

    res.status(200).json({ teachers });
  } catch (error) {
    console.log(error);
  }
};

const listChatStudents = async (req, res) => {
  try {
    const teacherId = req.userId;
    const chats = await ChatModel.find({ participants: teacherId });
    console.log(chats);
    let students = [];
    for (const chat of chats) {
      const userId = chat.participants.find((id) => !id.equals(teacherId));
      const student = await userModel.findById(userId);
      students.push(student);
    }

    res.status(200).json({ students });
  } catch (error) {
    console.log(error);
  }
};

export {
  getChatDetails,
  sendMessage,
  allMessages,
  getAllTeachers,
  listChatStudents,
};

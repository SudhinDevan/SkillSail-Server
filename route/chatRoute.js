import express from "express";
const router = express.Router();

import {
  allMessages,
  getAllTeachers,
  listChatStudents,
  //   getChatDetails,
} from "../controller/chatController.js";

router.get("/message/:id", allMessages);
// router.get("/chats", getChatDetails)
router.get("/teachers", getAllTeachers);
router.get("/listStudents", listChatStudents)

export default router;

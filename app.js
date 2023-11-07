import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoute from "./route/userRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

const port = process.env.PORT;
app.use("/", userRoute);

const db = process.env.DATABASE;

mongoose
  .connect(db)
  .then(() => {
    app.listen(port);
    console.log("Database connected and listening on port:", port);
  })
  .catch((err) => console.log(err));

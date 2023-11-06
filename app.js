import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoute from "./route/userRoute.js";

const app = express();
dotenv.config();

const port = process.env.PORT;

app.use("/api", userRoute);

mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    app.listen(port);
    console.log("Database connected and listening on port:", port);
  })
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.status(201).json("server started");
});

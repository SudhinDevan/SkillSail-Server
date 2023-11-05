import express from "express";
import dotenv from "dotenv";

const app = express();
dotenv.config();

app.get("/", (req, res) => {
  res.status(201).json("server started");
});

const port = process.env.PORT;

app
  .listen(port, () => {
    console.log("Server started at port ", port);
  })
  .on("error", (error) => {
    console.error("Server failed to start: ", error);
  });

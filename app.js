import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoute from "./route/userRoute.js";
import adminRoute from "./route/adminRoute.js";
import vendorRoute from "./route/vendorRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
dotenv.config();
app.use(
  express.json({
    limit: "100mb",
  })
);
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

const port = process.env.PORT;
app.use("/", userRoute);
app.use("/admin", adminRoute);
app.use("/tutor", vendorRoute);

const db = process.env.DATABASE;

mongoose
  .connect(db)
  .then(() => {
    app.listen(port);
    console.log("Database connected and listening on port:", port);
  })
  .catch((err) => console.log(err));

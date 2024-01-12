import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoute from "./route/userRoute.js";
import adminRoute from "./route/adminRoute.js";
import authRoute from "./route/authRoute.js";
import vendorRoute from "./route/vendorRoute.js";
import chatRoute from "./route/chatRoute.js";
import { verifyJWT } from "./middleware/verifyJwt.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import verifyUserRole from "./middleware/verifyUserAccess.js";
import verifyTutorRole from "./middleware/verifyTutorAccess.js";
import verifyAdminRole from "./middleware/verifyAdminAccess.js";
import ErrorHandler from "./middleware/errorHandler.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { configureSocket } from "./config/socket.js";
import { corsOptions } from "./config/corsOptions.js";
import { credentials } from "./middleware/credentials.js";
import { allowedOrigins } from "./config/allowedOrigins.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  maxHttpBufferSize: 1e8 ,
  transports: ["websocket", "polling"],
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});
configureSocket(io);
dotenv.config();

app.use(credentials)
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(
  express.json({
    limit: "100mb",
  })
);

const port = process.env.PORT;

app.use("/", authRoute);

app.use(verifyJWT);

app.use("/chat", chatRoute);
app.use("/user", verifyUserRole, userRoute);
app.use("/tutor", verifyTutorRole, vendorRoute);
app.use("/admin", verifyAdminRole, adminRoute);
app.use(ErrorHandler);

const db = process.env.DATABASE;

mongoose
  .connect(db)
  .then(() => {
    server.listen(port);
    console.log("Database connected and listening on port:", port);
  })
  .catch((err) => console.log(err));

import { allowedOrigins } from "./allowedOrigins.js";

const corsOptions = {
  origin: (origin, callback) => {
    console.log(origin);
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      console.log("allowed ");
      callback(null, true);
    } else {
      console.log("not allowed ");
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
  credentials: true,
  origin: true,
};

export { corsOptions };

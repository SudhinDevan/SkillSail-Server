import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

let accessTokenKey = process.env.JWT_SECRET_KEY;

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  jwt.verify(token, accessTokenKey, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.userId = decoded.userId;
    next();
  });
};

export { verifyJWT };

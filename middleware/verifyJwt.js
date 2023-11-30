import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

let jwtPrivateKey = process.env.JWT_SECRET_KEY;

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  jwt.verify(token, jwtPrivateKey, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = decoded.username;
    next();
  });
};

export { verifyJWT };

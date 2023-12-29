import userModel from "../model/userSchema.js";

const ROLES = {
  User: 2000,
  tutor: 3000,
  Admin: 1000,
};

const verifyTutorRole = async (req, res, next) => {
  const userData = await userModel.findById(req.userId);
  if (userData.role != ROLES.tutor) return res.status(401).json({ role: true });
  if (!userData.isAccess) return res.status(401).json({ access: true });
  next();
};

export default verifyTutorRole;

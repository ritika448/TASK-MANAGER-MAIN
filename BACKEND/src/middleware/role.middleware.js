import { User } from "../models/User.js";

export async function requireManager(req, res, next) {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    if (user.role !== "manager") {
      return res.status(403).json({ message: "Manager access is required." });
    }

    req.currentUser = user;
    return next();
  } catch (error) {
    return next(error);
  }
}

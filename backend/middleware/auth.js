import jwt from "jsonwebtoken";
import User from "../models/User.js";


export async function protect(req, res, next) {
  try {

    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required"
      });
    }

    const token = header.split(" ")[1];

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User
      .findById(payload.id)
      .select("-password");

    if (!user || !user.isActive) {
      return res.status(401).json({
        message: "Invalid or inactive account"
      });
    }

    req.user = user;

    next();

  } catch (error) {

    return res.status(401).json({
      message: "Invalid or expired token"
    });

  }
}


export const allow = (...roles) => {

  return (req, res, next) => {

    if (!roles.includes(req.user.role)) {

      return res.status(403).json({
        message: "Access denied"
      });

    }

    next();
  };
};
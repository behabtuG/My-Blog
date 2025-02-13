import jwt from "jsonwebtoken";
import { errorHandler } from "./errorHandler.js";

export const verifyToken = (req, res, next) => {
  // console.log("Headers:", req.headers); //✅ Debug log
  // console.log("Cookies:", req.cookies); //✅ Debug log
  const token = req.cookies.access_token;
  // console.log("backend verifyToken", token); //✅ Debug log
  if (!token) {
    return next(errorHandler(401, "Unauthorized"));
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // Handle token expiration or other errors
      if (err.name === "TokenExpiredError") {
        return next(errorHandler(401, "Token expired Sign In Again"));
      }
      return next(errorHandler(403, "Forbidden"));
    }
    // console.log("Verified user:", user); // Debug log
    req.user = user; //? Attach user to request
    next();
  });
};

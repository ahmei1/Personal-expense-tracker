import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  try {
    // Get JWT from the HttpOnly cookie
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach authenticated user to request
    req.user = {
      userId: decoded.userId,
    };

    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired session",
    });
  }
};
import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No authorization Login again",
      });
    }

    const token = authHeader.split(" ")[1];

    const token_decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (token_decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access only",
      });
    }
    req.user = token_decoded;
    next();
  } catch (err) {
    console.error("adminAuth error:", err);
    return res.status(401).json({ success: false, message: "Invalid or expired admin session. Please log in again." });
  }
};

export default adminAuth;

import jwt from "jsonwebtoken";

const deliveryAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication token missing. Please log in.",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const role = (decoded.role || "").toLowerCase();
    // Allow deliveryBoy / delivery, and admin for supervisory access
    if (role !== "deliveryboy" && role !== "delivery" && role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Delivery partner role required.",
      });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Session expired or invalid token. Please log in again.",
    });
  }
};

export default deliveryAuth;

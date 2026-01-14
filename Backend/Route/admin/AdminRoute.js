import express from "express";
import adminProductRouter from "./AdminProductRoute.js";
import Auth from "../../Middleware/adminAuth.js";
import { getUsersByRole, getUserDetails, getAdminStats } from "../../Controllers/userController.js";

const adminRouter = express.Router();

// Mount admin product routes under /products
adminRouter.use("/products", adminProductRouter);

// User Management Routes
adminRouter.get("/stats", Auth, getAdminStats);
adminRouter.get("/users/:role", Auth, getUsersByRole);
adminRouter.get("/user/:userId", Auth, getUserDetails);

export default adminRouter;

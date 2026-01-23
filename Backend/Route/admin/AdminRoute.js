import express from "express";
import adminProductRouter from "./AdminProductRoute.js";
import Auth from "../../Middleware/adminAuth.js";
import { getUsersByRole, getUserDetails, getAdminStats, changeUserStatus } from "../../Controllers/userController.js";
import { allOrders, updateStatus } from "../../Controllers/orderController.js";

const adminRouter = express.Router();

// Mount admin product routes under /products
adminRouter.use("/products", adminProductRouter);

// User Management Routes
adminRouter.get("/stats", Auth, getAdminStats);
adminRouter.get("/users/:role", Auth, getUsersByRole);
adminRouter.get("/user/:userId", Auth, getUserDetails);
adminRouter.post("/users/status", Auth, changeUserStatus);

// Order Management Routes
adminRouter.get("/orders", Auth, allOrders);
adminRouter.post("/orders/update-status", Auth, updateStatus);

export default adminRouter;

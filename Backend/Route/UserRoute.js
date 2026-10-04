import express from "express";
import { registerUser, loginUser, googleLogin, updateProfile, forgotPassword } from "../Controllers/userController.js";
import Auth from "../Middleware/Auth.js";
const userRouter = express.Router();

// Register user route
userRouter.post("/signup", registerUser);

// Login user route
userRouter.post("/signin", loginUser);
userRouter.post("/login", loginUser);
userRouter.post("/google-signin", googleLogin);

// Forgot & reset password routes
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", forgotPassword);

// pages
userRouter.put("/profile", Auth, updateProfile);

export default userRouter;
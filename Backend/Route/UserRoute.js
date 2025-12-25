import express from "express";
import { registerUser, loginUser } from "../Controllers/userController.js";

const userRouter=express.Router();

// Register user route
userRouter.post("/signup",registerUser);

// Login user route
userRouter.post("/signin",loginUser);
userRouter.post("/login", loginUser);

export default userRouter
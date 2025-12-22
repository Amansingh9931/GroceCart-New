import express from "express";
import { registerUser } from "../Controllers/user.js";

const userRouter=express.Router();

// Register user route
userRouter.post("/register",registerUser);

export default userRouter
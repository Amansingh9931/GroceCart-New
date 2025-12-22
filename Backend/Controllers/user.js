import UserModel from "../Models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import validator from "validator";

// Register a new User
const registerUser=async(req,res)=>{
    try{
        const {name,email,password}=req.body;

        //check if user already exists
        const existingUser= await UserModel.findOne({email});
        if(existingUser){
            return res.status(400).json({success: false, message : "User already exists"});
        }

        // validate email
        if (!validator.isEmail(email)) {
            return res
        .status(400)
        .json({ success: false, message: "invalid email format" });
        }

        // validate password
        if (password.length < 8) {
        return res.status(400).json({
                success: false,
                message: "password is not strong enough",
            });
        }
        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create new user
        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: "User registered successfully",
        });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error ",
        });
    }
}


export {registerUser}
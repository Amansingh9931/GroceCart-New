import UserModel from "../Models/UserModel.js";
import bcrypt from "bcryptjs";
import validator from "validator";
import "dotenv/config";
import jwt from "jsonwebtoken";


// User Registration 
const registerUser = async (req, res) => {
  try {
    const { name, email, password, mobile, role } = req.body;

    // 1️⃣ Required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    // 2️⃣ Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // 3️⃣ Password strength
    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, and a number",
      });
    }

    // 4️⃣ Check existing user
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // 5️⃣ Allowed roles (SECURE)
    let userRole = "user"; // default customer

    if (role === "deliveryBoy") {
      userRole = "deliveryBoy";
    }

    // ❌ Prevent admin registration
    if (role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin registration is not allowed",
      });
    }

    // 6️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 7️⃣ Create user
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      mobile,
      role: userRole,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: `Registered successfully as ${userRole}`,
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// User Login 
const loginUser= async(req,res)=>{
    try{
        const{email,password}=req.body;

        // Required fields
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Email and Password are required"
            });
        }

        // ================= ADMIN LOGIN CHECK =================

      if (
      email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase() &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES }
      );

      return res.status(200).json({
        success: true,
        message: "Admin login successful",
        data: {
          user: {
            name: "Admin",
            email,
            role: "admin",
          },
          token,
        },
      });
    }

    // ================= NORMAL USER LOGIN =================
        //check user existence
        const user=await UserModel.findOne({email});
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            });
        }

        //password verify
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(401).json({
                success:false,
                message:"Invalid credentials"
            });
        }

        // ✅ CREATE JWT TOKEN
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );

        //Sucessful Login (send user and token)
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            token,
        },
    });
    }catch(err){
        console.log("Login Error : ",err);
        res.status(500).json({
            success:false,
            message:"Internal server error"
        });
    }
}

// Admin Login 
// const adminLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (
//       email === process.env.ADMIN_EMAIL &&
//       password === process.env.ADMIN_PASSWORD
//     ) {
//       const token = jwt.sign(
//         { role: "admin" },
//         process.env.JWT_SECRET,
//         { expiresIn: process.env.JWT_EXPIRES }
//       );

//       return res.status(200).json({
//         success: true,
//         message: "Admin login successful",
//         data: {
//           user: {
//             name: "Admin",
//             email,
//             role: "admin",
//           },
//           token,
//         },
//       });
//     }

//     res.status(401).json({
//       success: false,
//       message: "Invalid admin credentials",
//     });
//   } catch (err) {
//     console.error("Admin Login Error:", err);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

export { registerUser, loginUser };
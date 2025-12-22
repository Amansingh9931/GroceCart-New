import mongoose from "mongoose";
import "dotenv/config";

console.log(process.env.MONGODB_URL);

const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("MongoDB connected successfully");
    }
    catch(err){
        console.log("MongoDB connection failed",err);
        process.exit(1);
    }
}
export default connectDB;
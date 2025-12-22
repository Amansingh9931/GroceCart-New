import mongoose from "mongoose"

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique: true,
    },
    password:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        required:false
    },
    role:{
        type:String,
        enum: ["user", "admin", "deliveryBoy"],
        default:"user"
    }
},{timestamps:true});

const UserModel=mongoose.model("user",userSchema);
export default UserModel;
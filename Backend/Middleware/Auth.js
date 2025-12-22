import jwt from "jsonwebtoken";

const authUser=(req,res,next)=>{
    try{
        const token=req.header("Authorization").replace("Bearer ","");
        if(!token){
            return res.status(401).json({success:false,message:"No token, authorization denied"});
        }

        const decoded =jwt.verify(token,process.env.JWT_SECRET);
        req.user= decoded.user;
        next();
    }catch(err){
        console.log("JWT ERROR:", err.message);
    return res
      .status(401)
      .json({ success: false, message: "Session expired or invalid token" });
    }
}

export default authUser;
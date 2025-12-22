import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./Config/db.js";
import userRouter from "./Route/UserRoute.js";

const app = express();
const PORT = process.env.PORT || 3000;

//connect to database
connectDB();


//middleware
app.use(cors());
app.use(express.json());


//routes
app.use("/api/user",userRouter);

//test route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

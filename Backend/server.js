import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./Config/db.js";

const app = express();
const PORT = process.env.PORT || 3000;

//middleware
app.use(cors());
app.use(express.json());

//connect to database
connectDB();

//routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

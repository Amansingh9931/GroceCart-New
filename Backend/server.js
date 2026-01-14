import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./Config/db.js";
import userRouter from "./Route/UserRoute.js";
import adminRouter from "./Route/admin/AdminRoute.js";
// import productRouter from "./Route/user/UserProductRoute.js";
import cartRouter from "./Route/user/CartRoute.js";
import productPublicRouter from "./Route/user/ProductPublicRoute.js";
import orderRouter from "./Route/user/OrderRoute.js";

const app = express();
const PORT = process.env.PORT || 8000;

//connect to database
await connectDB();


//middleware
app.use(cors());
app.use(express.json());


//routes
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
// app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/product", productPublicRouter);
app.use("/api/order", orderRouter);


//test route
// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

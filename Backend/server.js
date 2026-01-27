import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./Config/db.js";
import userRouter from "./Route/UserRoute.js";
import adminRouter from "./Route/admin/AdminRoute.js";
// import productRouter from "./Route/user/UserProductRoute.js";
import cartRouter from "./Route/user/CartRoute.js";
import UserProductRouter from "./Route/user/UserProductRoute.js";
import orderRouter from "./Route/user/OrderRoute.js";
import addressRouter from "./Route/user/AddressRoute.js";
import deliveryRouter from "./Route/delivery/DeliveryRoute.js";

const app = express();
const PORT = process.env.PORT || 8000;

//connect to database
await connectDB();


//middleware
app.use(cors({
  origin: "http://localhost:5173", // your frontend URL
  credentials: true
}));
app.use(express.json());


//routes
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/cart", cartRouter);
app.use("/api/products", UserProductRouter);
app.use("/api/order", orderRouter);
app.use("/api/address", addressRouter);
app.use("/api/delivery", deliveryRouter);


//test route
// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

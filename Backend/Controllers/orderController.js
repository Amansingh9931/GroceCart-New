import orderModel from "../Models/OrderModel.js";
import userModel from "../Models/UserModel.js";
import AddressModel from "../Models/AddressModel.js";
import productModel from "../Models/ProductModel.js";

//placing order using cod method
const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, amount, addressId } = req.body;

    // Verify address belongs to user
    const address = await AddressModel.findOne({ _id: addressId, userId });
    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    const orderData = {
      userId,
      items,
      amount,
      addressId,
      paymentMethod: "COD",
      payment: false,
      date: new Date(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed", orderId: newOrder._id });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

//placing order using stripe
const placeOrderStripe = async (req, res) => {};

//placing orders using razorpay method
const placeOrderRazorpay = async (req, res) => {};

// all order data for admin
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).populate("addressId");
    
    // Fetch product images for each item in orders
    const ordersWithImages = await Promise.all(
      orders.map(async (order) => {
        const orderObj = order.toObject();
        orderObj.items = await Promise.all(
          orderObj.items.map(async (item) => {
            try {
              const product = await productModel.findById(item._id || item.id);
              return {
                ...item,
                image: product?.imageUrl?.[0] || null,
              };
            } catch (err) {
              return item;
            }
          })
        );
        return orderObj;
      })
    );

    res.json({ success: true, orders: ordersWithImages });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

// order data for frontend
const userOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await orderModel.find({ userId }).populate("addressId");

    // Fetch product images for each item in orders
    const ordersWithImages = await Promise.all(
      orders.map(async (order) => {
        const orderObj = order.toObject();
        orderObj.items = await Promise.all(
          orderObj.items.map(async (item) => {
            try {
              const product = await productModel.findById(item._id || item.id);
              return {
                ...item,
                image: product?.imageUrl?.[0] || null,
              };
            } catch (err) {
              return item;
            }
          })
        );
        return orderObj;
      })
    );

    res.json({ success: true, orders: ordersWithImages });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

//update order status from admin
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status Updated" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

export {
  placeOrder,
  placeOrderRazorpay,
  placeOrderStripe,
  allOrders,
  userOrders,
  updateStatus,
};

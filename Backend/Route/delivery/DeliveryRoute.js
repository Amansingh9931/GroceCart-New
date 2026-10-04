import express from "express";
import {
  getAvailableOrders,
  acceptOrder,
  getActiveDelivery,
  markOutForDelivery,
  markDelivered,
  getDeliveryHistory,
  getEarnings,
  rejectOrder,
} from "../../Controllers/deliveryController.js";
import deliveryAuth from "../../Middleware/deliveryAuth.js";

const router = express.Router();

// Delivery routes (all strictly guarded by delivery partner RBAC)
router.get("/available-orders", deliveryAuth, getAvailableOrders);
router.post("/accept-order", deliveryAuth, acceptOrder);
router.post("/reject-order", deliveryAuth, rejectOrder);
router.get("/active-delivery", deliveryAuth, getActiveDelivery);
router.post("/mark-out-for-delivery", deliveryAuth, markOutForDelivery);
router.post("/mark-delivered", deliveryAuth, markDelivered);
router.get("/history", deliveryAuth, getDeliveryHistory);
router.get("/earnings", deliveryAuth, getEarnings);

export default router;

import express from "express";
import { listProduct, singleProduct } from "../../Controllers/productController.js";

const router = express.Router();

// public product list
router.get("/list", listProduct);
router.get("/:id", singleProduct);

export default router;

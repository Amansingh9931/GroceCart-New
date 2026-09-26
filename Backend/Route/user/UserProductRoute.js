import express from "express";
import { listAllProducts, singleProduct } from "../../Controllers/productController.js";

const router = express.Router();

// Public product listing used by frontend
router.get("/list", listAllProducts);

// Single product by id
router.get("/:id", singleProduct);

export default router;

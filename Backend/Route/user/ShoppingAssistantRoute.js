import express from "express";
import { chatWithShoppingAssistant } from "../../Controllers/shoppingAssistantController.js";

const router = express.Router();

router.post("/chat", chatWithShoppingAssistant);

export default router;

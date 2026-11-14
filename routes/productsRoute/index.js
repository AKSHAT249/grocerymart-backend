import express from "express";
import { fetchProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../../controllers/productsController/index.js";
import upload from "../../middlewares/upload.js";
import verifyToken from "../../middlewares/authMiddleware.js";
import authorizeRole from "../../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/", fetchProducts);
router.get("/:id", getProductById);
router.post("/", verifyToken, authorizeRole("admin"), upload.single("product_image_url"), createProduct);
router.put("/:id", verifyToken, authorizeRole("admin"), upload.single("product_image_url"), updateProduct);
router.delete("/:id", verifyToken, authorizeRole("admin"), deleteProduct);

export default router;
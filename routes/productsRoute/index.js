import express from "express";
import { fetchProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../../controllers/productsController/index.js";
import upload from "../../middlewares/upload.js";

const router = express.Router();

router.get("/", fetchProducts);
router.get("/:id", getProductById);
router.post("/", upload.single("product_image_url"), createProduct);
router.put("/:id", upload.single("product_image_url"), updateProduct);
router.delete("/:id", deleteProduct);

export default router;
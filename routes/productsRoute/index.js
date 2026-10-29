import express from "express";
import { fetchProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../../controllers/productsController/index.js";


const router = express.Router();

router.get("/", fetchProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
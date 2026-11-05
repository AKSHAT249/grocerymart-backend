import { Router } from "express";
import { fetchAllCategories, fetchActiveCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from "../../controllers/categoryController/index.js";


const router = Router();

router.get("/", fetchAllCategories);
router.get("/active", fetchActiveCategories);
router.get("/:id", getCategoryById);
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
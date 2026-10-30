import { Router } from "express";
import { fetchCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from "../../controllers/categoryController/index.js";


const router = Router();

router.get("/", fetchCategories);
router.get("/:id", getCategoryById);
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
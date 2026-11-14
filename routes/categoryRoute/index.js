import { Router } from "express";
import { fetchAllCategories, fetchActiveCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from "../../controllers/categoryController/index.js";
import verifyToken from "../../middlewares/authMiddleware.js";
import authorizeRole from "../../middlewares/roleMiddleware.js";

const router = Router();

router.get("/", fetchAllCategories);
router.get("/active", fetchActiveCategories);
router.get("/:id", getCategoryById);
router.post("/", verifyToken, authorizeRole("admin"), createCategory);
router.put("/:id", verifyToken, authorizeRole("admin"), updateCategory);
router.delete("/:id", verifyToken, authorizeRole("admin"), deleteCategory);

export default router;
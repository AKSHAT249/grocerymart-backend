import { Router } from "express";
import { fetchSubcategories, createSubcategory, updateSubcategory, deleteSubcategory } from "../../controllers/subcateoryController/index.js";
import upload from "../../middlewares/upload.js";
import verifyToken from "../../middlewares/authMiddleware.js";
import authorizeRole from "../../middlewares/roleMiddleware.js";

const router = Router();

router.get("/:categoryId", fetchSubcategories);
router.post("/:categoryId", verifyToken, authorizeRole("admin"), upload.single("image"), createSubcategory);
router.put("/:subcategoryId", verifyToken, authorizeRole("admin"), upload.single("image"), updateSubcategory);
router.delete("/:subcategoryId", verifyToken, authorizeRole("admin"), deleteSubcategory);

export default router;
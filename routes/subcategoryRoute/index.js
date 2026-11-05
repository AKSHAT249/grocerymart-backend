import { Router } from "express";
import { fetchSubcategories, createSubcategory, updateSubcategory, deleteSubcategory } from "../../controllers/subcateoryController/index.js";
import upload from "../../middlewares/upload.js";

const router = Router();

router.get("/:categoryId", fetchSubcategories);
router.post("/:categoryId", upload.single("image"), createSubcategory);
router.put("/:subcategoryId", upload.single("image"), updateSubcategory);
router.delete("/:subcategoryId", deleteSubcategory);

export default router;
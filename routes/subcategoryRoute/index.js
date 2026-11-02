import { Router } from "express";
import { fetchSubcategories } from "../../controllers/subcateoryController/index.js";

const router = Router();

router.get("/:categoryId", fetchSubcategories);

export default router;
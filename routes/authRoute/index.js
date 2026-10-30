import { Router } from "express";
import { createAdmin, adminLogin } from "../../controllers/adminController/index.js";

const router = Router();

router.post("/create-admin", createAdmin);
router.post("/admin-login", adminLogin);

export default router;
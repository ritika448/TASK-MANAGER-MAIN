import { Router } from "express";
import { getCurrentUser, updateCurrentUser } from "../controllers/user.controller.js";

const router = Router();

router.get("/GetModel", getCurrentUser);
router.put("/Update", updateCurrentUser);

export default router;

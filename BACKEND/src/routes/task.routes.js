import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTaskList,
  getTaskModel,
  updateTask,
} from "../controllers/task.controller.js";
import { requireManager } from "../middleware/role.middleware.js";

const router = Router();

router.get("/GetList", getTaskList);
router.get("/GetModel/:id", getTaskModel);
router.post("/Insert", requireManager, createTask);
router.put("/Update/:id", requireManager, updateTask);
router.delete("/Delete/:id", requireManager, deleteTask);

export default router;

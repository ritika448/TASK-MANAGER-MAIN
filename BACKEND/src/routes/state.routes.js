import { Router } from "express";
import {
  createState,
  deleteState,
  getStateList,
  getStateLookupList,
  getStateModel,
  updateState,
} from "../controllers/state.controller.js";

const router = Router();

router.get("/GetList", getStateList);
router.get("/GetLookupList", getStateLookupList);
router.get("/GetModel/:id", getStateModel);
router.post("/Insert", createState);
router.put("/Update/:id", updateState);
router.delete("/Delete/:id", deleteState);

export default router;

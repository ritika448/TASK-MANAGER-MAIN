import { Router } from "express";
import {
  createUser,
  deleteUser,
  getLocationLookups,
  getUserList,
  getUserLookupList,
  getUserModel,
  updateUser,
} from "../controllers/user.controller.js";

const router = Router();

router.get("/GetList", getUserList);
router.get("/GetLookupList", getUserLookupList);
router.get("/GetModel/:id", getUserModel);
router.get("/LocationLookups", getLocationLookups);
router.post("/Insert", createUser);
router.put("/Update/:id", updateUser);
router.delete("/Delete/:id", deleteUser);

export default router;

import { Router } from "express";
import {
  createCity,
  deleteCity,
  getCityList,
  getCityLookupList,
  getCityModel,
  updateCity,
} from "../controllers/city.controller.js";

const router = Router();

router.get("/GetList", getCityList);
router.get("/GetLookupList", getCityLookupList);
router.get("/GetModel/:id", getCityModel);
router.post("/Insert", createCity);
router.put("/Update/:id", updateCity);
router.delete("/Delete/:id", deleteCity);

export default router;
